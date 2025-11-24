import { Injectable, Logger } from '@nestjs/common';
import CircuitBreaker from 'opossum';
import { Observable } from 'rxjs';

/**
 * Circuit Breaker Options
 * Configuración del patrón Circuit Breaker
 */
export interface CircuitBreakerOptions {
  timeout?: number; // Tiempo máximo de espera (ms)
  errorThresholdPercentage?: number; // Porcentaje de errores para abrir circuito
  resetTimeout?: number; // Tiempo para intentar cerrar el circuito (ms)
  rollingCountTimeout?: number; // Ventana de tiempo para calcular estadísticas (ms)
  rollingCountBuckets?: number; // Número de buckets para estadísticas
  name?: string; // Nombre del circuit breaker
}

/**
 * Fallback Response
 * Respuesta por defecto cuando el circuito está abierto
 */
export interface FallbackResponse {
  error: boolean;
  message: string;
  statusCode: number;
  circuitBreakerOpen: boolean;
}

/**
 * Circuit Breaker Service
 * Implementa el patrón Circuit Breaker para proteger llamadas a microservicios
 *
 * RF: Disponibilidad - Circuit Breaker
 * Métrica: Degradación elegante ante servicios caídos
 *
 * Estados del Circuit Breaker:
 * - CLOSED: Funcionamiento normal
 * - OPEN: Circuito abierto, rechaza llamadas
 * - HALF_OPEN: Probando si el servicio se recuperó
 */
@Injectable()
export class CircuitBreakerService {
  private readonly logger = new Logger(CircuitBreakerService.name);
  private breakers: Map<string, CircuitBreaker> = new Map();

  // Configuración por defecto
  private readonly defaultOptions: CircuitBreakerOptions = {
    timeout: 5000, // 5 segundos
    errorThresholdPercentage: 50, // 50% de errores
    resetTimeout: 30000, // 30 segundos para reintentar
    rollingCountTimeout: 10000, // Ventana de 10 segundos
    rollingCountBuckets: 10, // 10 buckets
  };

  /**
   * Ejecuta una llamada protegida por Circuit Breaker
   *
   * @param key - Identificador único del circuit breaker (ej: 'auth-service')
   * @param observableFunc - Función que retorna un Observable
   * @param fallback - Función de fallback opcional
   * @param options - Opciones de configuración
   */
  async execute<T>(
    key: string,
    observableFunc: () => Observable<T>,
    fallback?: () => T | Promise<T>,
    options?: CircuitBreakerOptions,
  ): Promise<T> {
    const breaker = this.getOrCreateBreaker(key, options);

    try {
      // Convertir Observable a Promise y ejecutar con circuit breaker
      const result = await breaker.fire(observableFunc);
      return result as T;
    } catch (error: any) {
      this.logger.error(
        `Circuit breaker "${key}" caught error: ${error?.message || 'Unknown error'}`,
      );

      // Si hay fallback, ejecutarlo
      if (fallback) {
        this.logger.warn(`Executing fallback for "${key}"`);
        return await fallback();
      }

      // Si no hay fallback, lanzar error con información del circuit breaker
      throw {
        error: true,
        message: error?.message || 'Service temporarily unavailable',
        statusCode: error?.statusCode || 503,
        circuitBreakerOpen: breaker.opened,
        service: key,
      };
    }
  }

  /**
   * Obtiene o crea un circuit breaker
   */
  private getOrCreateBreaker(
    key: string,
    options?: CircuitBreakerOptions,
  ): CircuitBreaker {
    if (!this.breakers.has(key)) {
      const mergedOptions = { ...this.defaultOptions, ...options, name: key };

      // Crear función wrapper para convertir Observable a Promise
      const breaker = new CircuitBreaker(
        async (observableFunc: () => Observable<any>) => {
          return new Promise((resolve, reject) => {
            observableFunc().subscribe({
              next: (value) => resolve(value),
              error: (err) => reject(err),
              complete: () => {},
            });
          });
        },
        mergedOptions,
      );

      // Event listeners para logging y métricas
      this.setupEventListeners(breaker, key);

      this.breakers.set(key, breaker);
      this.logger.log(
        `Circuit breaker created for "${key}" with options: ${JSON.stringify(mergedOptions)}`,
      );
    }

    return this.breakers.get(key)!;
  }

  /**
   * Configura event listeners para el circuit breaker
   */
  private setupEventListeners(breaker: CircuitBreaker, key: string): void {
    // Circuito abierto
    breaker.on('open', () => {
      this.logger.error(
        `🔴 Circuit breaker "${key}" OPENED - Rejecting requests`,
      );
    });

    // Circuito semi-abierto (probando)
    breaker.on('halfOpen', () => {
      this.logger.warn(
        `🟡 Circuit breaker "${key}" HALF-OPEN - Testing service`,
      );
    });

    // Circuito cerrado (funcionando)
    breaker.on('close', () => {
      this.logger.log(
        `🟢 Circuit breaker "${key}" CLOSED - Service recovered`,
      );
    });

    // Llamada exitosa
    breaker.on('success', () => {
      this.logger.debug(`Circuit breaker "${key}" - Success`);
    });

    // Llamada fallida
    breaker.on('failure', (error: any) => {
      this.logger.warn(
        `Circuit breaker "${key}" - Failure: ${error?.message || 'Unknown error'}`,
      );
    });

    // Timeout
    breaker.on('timeout', () => {
      this.logger.warn(`Circuit breaker "${key}" - Timeout exceeded`);
    });

    // Llamada rechazada (circuito abierto)
    breaker.on('reject', () => {
      this.logger.warn(
        `Circuit breaker "${key}" - Request rejected (circuit open)`,
      );
    });

    // Fallback ejecutado
    breaker.on('fallback', () => {
      this.logger.log(`Circuit breaker "${key}" - Fallback executed`);
    });
  }

  /**
   * Obtiene estadísticas del circuit breaker
   */
  getStats(key: string) {
    const breaker = this.breakers.get(key);
    if (!breaker) {
      return null;
    }

    return {
      name: key,
      state: breaker.opened ? 'OPEN' : breaker.halfOpen ? 'HALF_OPEN' : 'CLOSED',
      stats: breaker.stats,
    };
  }

  /**
   * Obtiene estadísticas de todos los circuit breakers
   */
  getAllStats() {
    const stats: any[] = [];
    this.breakers.forEach((_breaker, key) => {
      stats.push(this.getStats(key));
    });
    return stats;
  }

  /**
   * Resetea manualmente un circuit breaker
   */
  reset(key: string): void {
    const breaker = this.breakers.get(key);
    if (breaker) {
      breaker.close();
      this.logger.log(`Circuit breaker "${key}" manually reset`);
    }
  }

  /**
   * Resetea todos los circuit breakers
   */
  resetAll(): void {
    this.breakers.forEach((breaker, key) => {
      breaker.close();
      this.logger.log(`Circuit breaker "${key}" manually reset`);
    });
  }
}
