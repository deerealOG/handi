// services/businessService.ts
// Business service provider operations for HANDI app

import { api, ApiResponse } from "./api";

// ================================
// Types
// ================================
export type BusinessStatus = "pending_verification" | "active" | "suspended";

export interface TeamMember {
  id: string;
  businessId: string;
  name: string;
  email: string;
  phone: string;
  role: "manager" | "technician" | "support";
  skills: string[];
  avatar?: string;
  isActive: boolean;
  joinedAt: string;
}

export interface ServiceOffering {
  id: string;
  businessId: string;
  categoryId: string;
  categoryName: string;
  description: string;
  basePrice: number;
  priceType: "fixed" | "hourly" | "quote";
  isActive: boolean;
  createdAt: string;
}

export interface BusinessJob {
  id: string;
  businessId: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  serviceType: string;
  description: string;
  address: string;
  city: string;
  scheduledDate: string;
  scheduledTime: string;
  estimatedPrice: number;
  status:
    | "pending"
    | "accepted"
    | "assigned"
    | "in_progress"
    | "completed"
    | "cancelled";
  assignedTeamMember?: string;
  assignedMemberName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessStats {
  totalJobs: number;
  activeJobs: number;
  completedJobs: number;
  totalEarnings: number;
  pendingPayouts: number;
  teamSize: number;
  rating: number;
  reviewCount: number;
}

export interface Availability {
  day: string;
  isOpen: boolean;
  start: string;
  end: string;
}

export interface BusinessProfile {
  id: string;
  businessName: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  avatar?: string;
  coverImage?: string;
  availability: Availability[];
  isVerified: boolean;
  verificationStatus?:
    | "pending"
    | "in_review"
    | "verified"
    | "rejected"
    | "suspended";
  cacNumber?: string;
  tinNumber?: string;
  cacDocumentUrl?: string;
  tinDocumentUrl?: string;
  utilityBillUrl?: string;
}

export type ProjectPriority = "low" | "medium" | "high" | "urgent";

export interface CreateProjectData {
  title: string;
  description: string;
  serviceType: string;
  requiredSkills: string[];
  budgetMin: number;
  budgetMax: number;
  address: string;
  city: string;
  state: string;
  priority: ProjectPriority;
  artisansNeeded: number;
}

const DEFAULT_AVAILABILITY: Availability[] = [
  { day: "Monday", isOpen: true, start: "09:00", end: "17:00" },
  { day: "Tuesday", isOpen: true, start: "09:00", end: "17:00" },
  { day: "Wednesday", isOpen: true, start: "09:00", end: "17:00" },
  { day: "Thursday", isOpen: true, start: "09:00", end: "17:00" },
  { day: "Friday", isOpen: true, start: "09:00", end: "17:00" },
  { day: "Saturday", isOpen: true, start: "10:00", end: "15:00" },
  { day: "Sunday", isOpen: false, start: "09:00", end: "17:00" },
];

const normalizeStatus = (status: string): BusinessJob["status"] => {
  switch (status) {
    case "PENDING":
      return "pending";
    case "ACCEPTED":
      return "accepted";
    case "ASSIGNED":
      return "assigned";
    case "IN_PROGRESS":
      return "in_progress";
    case "COMPLETED":
      return "completed";
    case "CANCELLED":
      return "cancelled";
    default:
      return "pending";
  }
};

const mapRoleFromApi = (role?: string): TeamMember["role"] => {
  switch (role) {
    case "MANAGER":
      return "manager";
    case "OWNER":
      return "manager";
    case "WORKER":
      return "technician";
    default:
      return "technician";
  }
};

const mapRoleToApi = (role: TeamMember["role"]): "MANAGER" | "WORKER" => {
  return role === "manager" ? "MANAGER" : "WORKER";
};

const mapPriceTypeFromApi = (priceType?: string): ServiceOffering["priceType"] => {
  switch (priceType) {
    case "HOURLY":
      return "hourly";
    case "QUOTE":
      return "quote";
    case "FIXED":
    default:
      return "fixed";
  }
};

const mapPriceTypeToApi = (
  priceType: ServiceOffering["priceType"],
): "FIXED" | "HOURLY" | "QUOTE" => {
  switch (priceType) {
    case "hourly":
      return "HOURLY";
    case "quote":
      return "QUOTE";
    case "fixed":
    default:
      return "FIXED";
  }
};

const mapBusinessProfile = (business: any): BusinessProfile => ({
  id: business.id,
  businessName: business.name || "",
  description: business.description || "",
  address: business.address || "",
  phone: business.phone || "",
  email: business.email || "",
  avatar: business.logo || undefined,
  coverImage: business.coverImage || undefined,
  availability: DEFAULT_AVAILABILITY,
  isVerified: !!business.isVerified,
  verificationStatus:
    business.verificationStatus?.toLowerCase() === "in_review"
      ? "in_review"
      : business.verificationStatus?.toLowerCase() === "verified"
        ? "verified"
        : business.verificationStatus?.toLowerCase() === "rejected"
          ? "rejected"
          : business.verificationStatus?.toLowerCase() === "suspended"
            ? "suspended"
            : "pending",
  cacNumber: business.cacNumber || undefined,
  tinNumber: business.tinNumber || undefined,
  cacDocumentUrl: business.cacDocumentUrl || undefined,
  tinDocumentUrl: business.tinDocumentUrl || undefined,
  utilityBillUrl: business.utilityBillUrl || undefined,
});

const mapTeamMember = (member: any): TeamMember => {
  const user = member.user || {};
  const fullName =
    user.fullName ||
    `${user.firstName || ""} ${user.lastName || ""}`.trim();

  return {
    id: member.userId || member.id,
    businessId: member.businessId,
    name: fullName || user.email || "Member",
    email: user.email || "",
    phone: user.phone || "",
    role: mapRoleFromApi(member.role),
    skills: Array.isArray(user.skills) ? user.skills : [],
    avatar: user.avatar || undefined,
    isActive: member.isActive !== undefined ? member.isActive : true,
    joinedAt: member.createdAt || new Date().toISOString(),
  };
};

const mapServiceOffering = (service: any): ServiceOffering => ({
  id: service.id,
  businessId: service.businessId,
  categoryId: service.categoryId,
  categoryName: service.categoryName,
  description: service.description,
  basePrice: Number(service.basePrice || 0),
  priceType: mapPriceTypeFromApi(service.priceType),
  isActive: service.isActive,
  createdAt: service.createdAt || new Date().toISOString(),
});

const mapBusinessJob = (booking: any): BusinessJob => ({
  id: booking.id,
  businessId: booking.businessId || "",
  clientId: booking.clientId || "",
  clientName:
    booking.clientName ||
    booking.client?.fullName ||
    booking.client?.name ||
    "Client",
  clientPhone:
    booking.clientPhone || booking.client?.phone || booking.client?.phoneNumber || "",
  serviceType: booking.serviceType || "",
  description: booking.description || "",
  address: booking.address || "",
  city: booking.city || "",
  scheduledDate: booking.scheduledDate
    ? new Date(booking.scheduledDate).toISOString()
    : new Date().toISOString(),
  scheduledTime: booking.scheduledTime || "",
  estimatedPrice: Number(booking.estimatedPrice || 0),
  status: normalizeStatus(booking.status),
  assignedTeamMember: booking.assignedMemberId || undefined,
  assignedMemberName: booking.assignedMemberName || undefined,
  createdAt: booking.createdAt || new Date().toISOString(),
  updatedAt: booking.updatedAt || new Date().toISOString(),
});

// ================================
// Business Service (Provider Model)
// ================================
export const businessService = {
  // ========== TEAM MANAGEMENT ==========

  /**
   * Get team members for a business
   */
  async getTeamMembers(businessId: string): Promise<TeamMember[]> {
    const response = await api.get<any[]>("/api/business/members");
    if (!response.success || !response.data) {
      return [];
    }
    return response.data.map(mapTeamMember);
  },

  /**
   * Add a team member
   */
  async addTeamMember(
    businessId: string,
    data: Omit<TeamMember, "id" | "businessId" | "isActive" | "joinedAt">,
  ): Promise<ApiResponse<TeamMember>> {
    const response = await api.post<any>("/api/business/invite", {
      email: data.email,
      role: mapRoleToApi(data.role),
    });

    if (!response.success) {
      return { success: false, error: response.error || "Failed to invite member" };
    }

    const member = response.data
      ? mapTeamMember({
          ...response.data,
          user: response.data.user || { email: data.email },
        })
      : undefined;
    return {
      success: true,
      data: member,
      message: response.message || "Team member invited",
    };
  },

  /**
   * Update team member status
   */
  async updateTeamMember(
    memberId: string,
    updates: Partial<TeamMember>,
  ): Promise<ApiResponse<TeamMember>> {
    const payload: Record<string, unknown> = {};
    if (updates.role) {
      payload.role = mapRoleToApi(updates.role);
    }
    if (updates.isActive !== undefined) {
      payload.isActive = updates.isActive;
    }

    const response = await api.patch<any>(`/api/business/members/${memberId}`, payload);

    if (!response.success) {
      return { success: false, error: response.error || "Failed to update member" };
    }

    return {
      success: true,
      data: response.data ? mapTeamMember(response.data) : undefined,
      message: response.message || "Team member updated",
    };
  },

  // ========== SERVICE OFFERINGS ==========

  /**
   * Get service offerings for a business
   */
  async getServiceOfferings(businessId: string): Promise<ServiceOffering[]> {
    const response = await api.get<any[]>("/api/business/services");
    if (!response.success || !response.data) {
      return [];
    }
    return response.data.map(mapServiceOffering);
  },

  /**
   * Add a service offering
   */
  async addServiceOffering(
    businessId: string,
    data: Omit<ServiceOffering, "id" | "businessId" | "isActive" | "createdAt">,
  ): Promise<ApiResponse<ServiceOffering>> {
    const response = await api.post<any>("/api/business/services", {
      categoryId: data.categoryId,
      categoryName: data.categoryName,
      description: data.description,
      basePrice: data.basePrice,
      priceType: mapPriceTypeToApi(data.priceType),
    });

    if (!response.success) {
      return { success: false, error: response.error || "Failed to create service" };
    }

    return {
      success: true,
      data: response.data ? mapServiceOffering(response.data) : undefined,
      message: response.message || "Service added successfully",
    };
  },

  /**
   * Toggle service active status
   */
  async toggleServiceStatus(serviceId: string): Promise<ApiResponse<ServiceOffering>> {
    const response = await api.post<any>(`/api/business/services/${serviceId}/toggle`);

    if (!response.success) {
      return { success: false, error: response.error || "Failed to update service" };
    }

    return {
      success: true,
      data: response.data ? mapServiceOffering(response.data) : undefined,
    };
  },

  // ========== JOB MANAGEMENT ==========

  /**
   * Get jobs for a business (incoming requests)
   */
  async getJobs(
    businessId: string,
    status?: BusinessJob["status"],
  ): Promise<BusinessJob[]> {
    const response = await api.get<any[]>("/api/business/jobs");
    if (!response.success || !response.data) {
      return [];
    }

    let jobs = response.data.map(mapBusinessJob);
    if (status) {
      jobs = jobs.filter((j) => j.status === status);
    }

    return jobs.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  },

  /**
   * Accept a job request
   */
  async acceptJob(jobId: string): Promise<ApiResponse<BusinessJob>> {
    const response = await api.post<any>(`/api/business/jobs/${jobId}/accept`);
    if (!response.success) {
      return { success: false, error: response.error || "Failed to accept job" };
    }
    return {
      success: true,
      data: response.data ? mapBusinessJob(response.data) : undefined,
      message: response.message || "Job accepted",
    };
  },

  /**
   * Decline a job request
   */
  async declineJob(
    jobId: string,
    reason?: string,
  ): Promise<ApiResponse<BusinessJob>> {
    const response = await api.post<any>(`/api/business/jobs/${jobId}/decline`, {
      reason,
    });
    if (!response.success) {
      return { success: false, error: response.error || "Failed to decline job" };
    }
    return {
      success: true,
      data: response.data ? mapBusinessJob(response.data) : undefined,
      message: response.message || "Job declined",
    };
  },

  /**
   * Assign a team member to a job
   */
  async assignTeamMember(
    jobId: string,
    memberId: string,
  ): Promise<ApiResponse<BusinessJob>> {
    const response = await api.post<any>(`/api/business/assign/${jobId}`, {
      memberId,
    });

    if (!response.success) {
      return { success: false, error: response.error || "Failed to assign member" };
    }

    return {
      success: true,
      data: response.data ? mapBusinessJob(response.data) : undefined,
      message: response.message || "Job assigned",
    };
  },

  /**
   * Update job status
   */
  async updateJobStatus(
    jobId: string,
    status: BusinessJob["status"],
  ): Promise<ApiResponse<BusinessJob>> {
    const apiStatus = status === "completed" ? "COMPLETED" : "IN_PROGRESS";
    const response = await api.patch<any>(`/api/business/jobs/${jobId}/status`, {
      status: apiStatus,
    });

    if (!response.success) {
      return { success: false, error: response.error || "Failed to update status" };
    }

    return {
      success: true,
      data: response.data ? mapBusinessJob(response.data) : undefined,
      message: response.message || "Status updated",
    };
  },

  // ========== STATISTICS ==========

  /**
   * Get business statistics
   */
  async getStats(businessId: string): Promise<BusinessStats> {
    const [jobs, team] = await Promise.all([
      this.getJobs(businessId),
      this.getTeamMembers(businessId),
    ]);

    const completedJobs = jobs.filter((j) => j.status === "completed");
    const activeJobs = jobs.filter(
      (j) =>
        j.status === "accepted" ||
        j.status === "assigned" ||
        j.status === "in_progress",
    );

    const totalEarnings = completedJobs.reduce((sum, j) => sum + j.estimatedPrice, 0);
    const pendingPayouts = activeJobs.reduce((sum, j) => sum + j.estimatedPrice, 0);

    return {
      totalJobs: jobs.length,
      activeJobs: activeJobs.length,
      completedJobs: completedJobs.length,
      totalEarnings,
      pendingPayouts,
      teamSize: team.filter((m) => m.isActive).length,
      rating: 4.8,
      reviewCount: completedJobs.length,
    };
  },

  /**
   * Get earnings summary
   */
  async getEarningsSummary(businessId: string): Promise<{
    total: number;
    thisMonth: number;
    lastMonth: number;
    pending: number;
  }> {
    const jobs = await this.getJobs(businessId);

    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const completedJobs = jobs.filter((j) => j.status === "completed");
    const activeJobs = jobs.filter(
      (j) =>
        j.status === "accepted" ||
        j.status === "assigned" ||
        j.status === "in_progress",
    );

    const total = completedJobs.reduce((sum, j) => sum + j.estimatedPrice, 0);

    const thisMonthTotal = completedJobs
      .filter((j) => new Date(j.updatedAt) >= thisMonth)
      .reduce((sum, j) => sum + j.estimatedPrice, 0);

    const lastMonthTotal = completedJobs
      .filter((j) => {
        const date = new Date(j.updatedAt);
        return date >= lastMonth && date < thisMonth;
      })
      .reduce((sum, j) => sum + j.estimatedPrice, 0);

    const pending = activeJobs.reduce((sum, j) => sum + j.estimatedPrice, 0);

    return {
      total,
      thisMonth: thisMonthTotal,
      lastMonth: lastMonthTotal,
      pending,
    };
  },

  // ========== PROFILE MANAGEMENT ==========

  /**
   * Get business profile
   */
  async getProfile(businessId: string): Promise<BusinessProfile> {
    const response = await api.get<any>("/api/business");
    if (!response.success || !response.data) {
      return {
        id: businessId,
        businessName: "",
        description: "",
        address: "",
        phone: "",
        email: "",
        availability: DEFAULT_AVAILABILITY,
        isVerified: false,
        verificationStatus: "pending",
      };
    }

    return mapBusinessProfile(response.data);
  },

  /**
   * Update business profile
   */
  async updateProfile(
    businessId: string,
    updates: Partial<BusinessProfile>,
  ): Promise<ApiResponse<BusinessProfile>> {
    const payload: Record<string, unknown> = {};
    if (updates.businessName !== undefined) payload.name = updates.businessName;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.address !== undefined) payload.address = updates.address;
    if (updates.phone !== undefined) payload.phone = updates.phone;
    if (updates.email !== undefined) payload.email = updates.email;
    if (updates.avatar !== undefined) payload.logo = updates.avatar;
    if (updates.coverImage !== undefined) payload.coverImage = updates.coverImage;

    const response = await api.patch<any>("/api/business/profile", payload);

    if (!response.success) {
      return { success: false, error: response.error || "Failed to update profile" };
    }

    return {
      success: true,
      data: response.data ? mapBusinessProfile(response.data) : undefined,
      message: response.message || "Profile updated",
    };
  },

  /**
   * Submit business verification documents
   */
  async submitVerification(
    businessId: string,
    data: {
      cacNumber: string;
      tinNumber: string;
      cacDocumentUrl: string;
      tinDocumentUrl: string;
      utilityBillUrl: string;
    },
  ): Promise<ApiResponse<BusinessProfile>> {
    const response = await api.post<any>("/api/business/verification", data);

    if (!response.success) {
      return { success: false, error: response.error || "Failed to submit verification" };
    }

    return {
      success: true,
      data: response.data ? mapBusinessProfile(response.data) : undefined,
      message: response.message || "Verification submitted",
    };
  },

  /**
   * Get verification status
   */
  async getVerificationStatus(
    businessId: string,
  ): Promise<BusinessProfile["verificationStatus"]> {
    const profile = await this.getProfile(businessId);
    return profile.verificationStatus || "pending";
  },

  /**
   * Create a project/job posting (not yet supported on backend)
   */
  async createProject(
    businessId: string,
    data: CreateProjectData,
  ): Promise<ApiResponse<{ id?: string }>> {
    const response = await api.post<any>("/api/business/projects", data);
    if (!response.success) {
      return { success: false, error: response.error || "Project creation not available yet" };
    }
    return { success: true, data: response.data, message: response.message };
  },
};

export default businessService;
