/**
 * Enums for Donations module
 * These match the Prisma schema in donaciones-service
 */

export enum DonationType {
  MONETARY = 'MONETARY', // Donación monetaria (PSE u otros)
  IN_KIND = 'IN_KIND',   // Donación en especie (física)
}

export enum PaymentMethod {
  PSE = 'PSE',                      // Pago electrónico PSE
  BANK_TRANSFER = 'BANK_TRANSFER', // Transferencia bancaria
  CASH = 'CASH',                   // Efectivo
  IN_KIND = 'IN_KIND',             // En especie
}

export enum DonationStatus {
  PENDING = 'PENDING',     // Pendiente de confirmación
  APPROVED = 'APPROVED',   // Aprobada y confirmada
  REJECTED = 'REJECTED',   // Rechazada
  CANCELLED = 'CANCELLED', // Cancelada
}
