import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class DonationsService {
  constructor(
    @Inject('DONACIONES_SERVICE')
    private readonly donacionesClient: ClientKafka,
  ) {}

  async createMonetary(data: any) {
    return await lastValueFrom(
      this.donacionesClient.send('donaciones_create_monetary', data),
    );
  }

  async createInKind(data: any) {
    return await lastValueFrom(
      this.donacionesClient.send('donaciones_create_inkind', data),
    );
  }

  async getAllDonations(query: any) {
    return await lastValueFrom(
      this.donacionesClient.send('donaciones_get_all', query),
    );
  }

  async getUserDonations(userId: number, query: any) {
    return await lastValueFrom(
      this.donacionesClient.send('donaciones_get_user_donations', {
        userId,
        ...query,
      }),
    );
  }

  async approveDonation(id: number, approvedBy: number) {
    return await lastValueFrom(
      this.donacionesClient.send('donaciones_approve', { id, approvedBy }),
    );
  }

  // ============================================================================
  // DONATION INFO
  // ============================================================================

  async getDonationInfo() {
    return await lastValueFrom(
      this.donacionesClient.send('donaciones_get_donation_info', {}),
    );
  }

  async createDonationInfo(data: any, updatedBy: number) {
    return await lastValueFrom(
      this.donacionesClient.send('donaciones_create_donation_info', {
        ...data,
        updatedBy,
      }),
    );
  }

  async updateDonationInfo(id: number, data: any, updatedBy: number) {
    return await lastValueFrom(
      this.donacionesClient.send('donaciones_update_donation_info', {
        id,
        ...data,
        updatedBy,
      }),
    );
  }

  // ============================================================================
  // TESTIMONIALS
  // ============================================================================

  async getPublishedTestimonials(limit?: number) {
    return await lastValueFrom(
      this.donacionesClient.send('donaciones_get_published_testimonials', { limit }),
    );
  }

  async getAllTestimonials(query: any) {
    return await lastValueFrom(
      this.donacionesClient.send('donaciones_get_all_testimonials', query),
    );
  }

  async createTestimonial(data: any, createdBy: number) {
    return await lastValueFrom(
      this.donacionesClient.send('donaciones_create_testimonial', {
        ...data,
        createdBy,
      }),
    );
  }

  async updateTestimonial(id: number, data: any) {
    return await lastValueFrom(
      this.donacionesClient.send('donaciones_update_testimonial', {
        id,
        ...data,
      }),
    );
  }

  async publishTestimonial(id: number) {
    return await lastValueFrom(
      this.donacionesClient.send('donaciones_publish_testimonial', { id }),
    );
  }

  async unpublishTestimonial(id: number) {
    return await lastValueFrom(
      this.donacionesClient.send('donaciones_unpublish_testimonial', { id }),
    );
  }

  async deleteTestimonial(id: number) {
    return await lastValueFrom(
      this.donacionesClient.send('donaciones_delete_testimonial', { id }),
    );
  }

  // ============================================================================
  // PSE
  // ============================================================================

  async processPseCallback(callbackData: any) {
    return await lastValueFrom(
      this.donacionesClient.send('donaciones_pse_callback', callbackData),
    );
  }

  // ============================================================================
  // CERTIFICATES
  // ============================================================================

  async generateCertificate(userId: number, year: number) {
    return await lastValueFrom(
      this.donacionesClient.send('donaciones_generate_certificate', { userId, year }),
    );
  }

  // ============================================================================
  // EXCEL EXPORTS & REPORTS
  // ============================================================================

  async exportExcel(filters: any) {
    return await lastValueFrom(
      this.donacionesClient.send('donaciones_export_excel', filters),
    );
  }

  async generateReport(reportData: any) {
    return await lastValueFrom(
      this.donacionesClient.send('donaciones_generate_report', reportData),
    );
  }
}
