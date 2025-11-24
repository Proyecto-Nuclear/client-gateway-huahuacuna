import { Controller, Get } from "@nestjs/common";
import { CircuitBreakerService } from "../common/circuit-breaker/circuit-breaker.service";

/**
 * Circuit Breaker Health Controller
 * Endpoint para obtener estadísticas de los circuit breakers
 *
 * GET /api/health/circuit-breakers
 */
@Controller('health/circuit-breakers')
export class CircuitBreakerHealthController {
  constructor(private readonly circuitBreaker: CircuitBreakerService) {}

  /**
   * Obtiene estadísticas de todos los circuit breakers
   */
  @Get()
  getStats() {
    return {
      timestamp: new Date().toISOString(),
      circuitBreakers: this.circuitBreaker.getAllStats(),
    };
  }

  /**
   * Obtiene estadísticas de un circuit breaker específico
   */
  @Get(':service')
  getServiceStats() {
    return {
      timestamp: new Date().toISOString(),
      circuitBreakers: this.circuitBreaker.getAllStats(),
    };
  }
}
