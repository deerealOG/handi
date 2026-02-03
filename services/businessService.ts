// services/businessService.ts
// Business service provider operations for HANDI app
// Businesses are like artisans but at company scale - they OFFER services

import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApiResponse } from "./api";

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

// ================================
// Storage Keys
// ================================
const TEAM_KEY = "business_team";
const SERVICES_KEY = "business_services";
const JOBS_KEY = "business_jobs";
const PROFILE_KEY = "business_profile";

const DEFAULT_AVAILABILITY: Availability[] = [
  { day: "Monday", isOpen: true, start: "09:00", end: "17:00" },
  { day: "Tuesday", isOpen: true, start: "09:00", end: "17:00" },
  { day: "Wednesday", isOpen: true, start: "09:00", end: "17:00" },
  { day: "Thursday", isOpen: true, start: "09:00", end: "17:00" },
  { day: "Friday", isOpen: true, start: "09:00", end: "17:00" },
  { day: "Saturday", isOpen: true, start: "10:00", end: "15:00" },
  { day: "Sunday", isOpen: false, start: "09:00", end: "17:00" },
];

// ================================
// Mock Data
// ================================
const MOCK_TEAM: TeamMember[] = [
  {
    id: "member_001",
    businessId: "business_001",
    name: "Chidi Okonkwo",
    email: "[EMAIL_ADDRESS]",
    phone: "+234 803 111 2222",
    role: "technician",
    skills: ["Electrician", "AC Repair"],
    isActive: true,
    joinedAt: "2024-06-15T10:00:00Z",
  },
  {
    id: "member_002",
    businessId: "business_001",
    name: "Amaka Eze",
    email: "[EMAIL_ADDRESS]",
    phone: "+234 803 333 4444",
    role: "technician",
    skills: ["Plumber", "Mason"],
    isActive: true,
    joinedAt: "2024-07-20T10:00:00Z",
  },
  {
    id: "member_003",
    businessId: "business_001",
    name: "Kunle Adeyemi",
    email: "[EMAIL_ADDRESS]",
    phone: "+234 803 555 6666",
    role: "manager",
    skills: [],
    isActive: true,
    joinedAt: "2024-05-01T10:00:00Z",
  },
];

const MOCK_SERVICES: ServiceOffering[] = [
  {
    id: "service_001",
    businessId: "business_001",
    categoryId: "electrical",
    categoryName: "Electrical Services",
    description:
      "Complete electrical installations, repairs, and maintenance for homes and offices.",
    basePrice: 15000,
    priceType: "quote",
    isActive: true,
    createdAt: "2024-06-01T10:00:00Z",
  },
  {
    id: "service_002",
    businessId: "business_001",
    categoryId: "plumbing",
    categoryName: "Plumbing Services",
    description:
      "Professional plumbing solutions including pipe repairs, installations, and water systems.",
    basePrice: 12000,
    priceType: "quote",
    isActive: true,
    createdAt: "2024-06-01T10:00:00Z",
  },
  {
    id: "service_003",
    businessId: "business_001",
    categoryId: "ac_repair",
    categoryName: "AC Repair & Maintenance",
    description:
      "Air conditioning installation, repair, and regular maintenance services.",
    basePrice: 20000,
    priceType: "fixed",
    isActive: true,
    createdAt: "2024-06-15T10:00:00Z",
  },
];

const MOCK_JOBS: BusinessJob[] = [
  {
    id: "bjob_001",
    businessId: "business_001",
    clientId: "user_001",
    clientName: "John Adebayo",
    clientPhone: "+234 812 345 6789",
    serviceType: "Electrical Services",
    description: "Complete office rewiring for 3-story building",
    address: "123 Victoria Island",
    city: "Lagos",
    scheduledDate: "2024-12-18",
    scheduledTime: "09:00 AM",
    estimatedPrice: 450000,
    status: "in_progress",
    assignedTeamMember: "member_001",
    assignedMemberName: "Chidi Okonkwo",
    createdAt: "2024-12-10T10:00:00Z",
    updatedAt: "2024-12-15T14:00:00Z",
  },
  {
    id: "bjob_002",
    businessId: "business_001",
    clientId: "user_002",
    clientName: "Ada Obi",
    clientPhone: "+234 815 678 9012",
    serviceType: "Plumbing Services",
    description: "Install new water system for residential complex",
    address: "45 Lekki Phase 1",
    city: "Lagos",
    scheduledDate: "2024-12-20",
    scheduledTime: "10:00 AM",
    estimatedPrice: 280000,
    status: "pending",
    createdAt: "2024-12-14T09:00:00Z",
    updatedAt: "2024-12-14T09:00:00Z",
  },
  {
    id: "bjob_003",
    businessId: "business_001",
    clientId: "user_003",
    clientName: "Emeka Johnson",
    clientPhone: "+234 802 111 3333",
    serviceType: "AC Repair & Maintenance",
    description: "AC servicing for 10 units in office building",
    address: "78 Allen Avenue",
    city: "Lagos",
    scheduledDate: "2024-12-12",
    scheduledTime: "11:00 AM",
    estimatedPrice: 180000,
    status: "completed",
    assignedTeamMember: "member_001",
    assignedMemberName: "Chidi Okonkwo",
    createdAt: "2024-12-05T08:00:00Z",
    updatedAt: "2024-12-12T16:00:00Z",
  },
];

// ================================
// Business Service (Provider Model)
// ================================
export const businessService = {
  /**
   * Seed mock data for demo
   */
  async seedMockData(): Promise<void> {
    const existing = await AsyncStorage.getItem(JOBS_KEY);
    if (!existing) {
      await AsyncStorage.setItem(TEAM_KEY, JSON.stringify(MOCK_TEAM));
      await AsyncStorage.setItem(SERVICES_KEY, JSON.stringify(MOCK_SERVICES));
      await AsyncStorage.setItem(JOBS_KEY, JSON.stringify(MOCK_JOBS));
    }
  },

  // ========== TEAM MANAGEMENT ==========

  /**
   * Get team members for a business
   */
  async getTeamMembers(businessId: string): Promise<TeamMember[]> {
    await this.seedMockData();
    const teamJson = await AsyncStorage.getItem(TEAM_KEY);
    const team: TeamMember[] = teamJson ? JSON.parse(teamJson) : [];
    return team.filter((m) => m.businessId === businessId);
  },

  /**
   * Add a team member
   */
  async addTeamMember(
    businessId: string,
    data: Omit<TeamMember, "id" | "businessId" | "isActive" | "joinedAt">,
  ): Promise<ApiResponse<TeamMember>> {
    const teamJson = await AsyncStorage.getItem(TEAM_KEY);
    const team: TeamMember[] = teamJson ? JSON.parse(teamJson) : [];

    const newMember: TeamMember = {
      id: `member_${Date.now()}`,
      businessId,
      ...data,
      isActive: true,
      joinedAt: new Date().toISOString(),
    };

    team.push(newMember);
    await AsyncStorage.setItem(TEAM_KEY, JSON.stringify(team));

    return {
      success: true,
      data: newMember,
      message: "Team member added successfully",
    };
  },

  /**
   * Update team member status
   */
  async updateTeamMember(
    memberId: string,
    updates: Partial<TeamMember>,
  ): Promise<ApiResponse<TeamMember>> {
    const teamJson = await AsyncStorage.getItem(TEAM_KEY);
    const team: TeamMember[] = teamJson ? JSON.parse(teamJson) : [];

    const index = team.findIndex((m) => m.id === memberId);
    if (index === -1) {
      return { success: false, error: "Team member not found" };
    }

    team[index] = { ...team[index], ...updates };
    await AsyncStorage.setItem(TEAM_KEY, JSON.stringify(team));

    return { success: true, data: team[index], message: "Team member updated" };
  },

  // ========== SERVICE OFFERINGS ==========

  /**
   * Get service offerings for a business
   */
  async getServiceOfferings(businessId: string): Promise<ServiceOffering[]> {
    await this.seedMockData();
    const servicesJson = await AsyncStorage.getItem(SERVICES_KEY);
    const services: ServiceOffering[] = servicesJson
      ? JSON.parse(servicesJson)
      : [];
    return services.filter((s) => s.businessId === businessId);
  },

  /**
   * Add a service offering
   */
  async addServiceOffering(
    businessId: string,
    data: Omit<ServiceOffering, "id" | "businessId" | "isActive" | "createdAt">,
  ): Promise<ApiResponse<ServiceOffering>> {
    const servicesJson = await AsyncStorage.getItem(SERVICES_KEY);
    const services: ServiceOffering[] = servicesJson
      ? JSON.parse(servicesJson)
      : [];

    const newService: ServiceOffering = {
      id: `service_${Date.now()}`,
      businessId,
      ...data,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    services.push(newService);
    await AsyncStorage.setItem(SERVICES_KEY, JSON.stringify(services));

    return {
      success: true,
      data: newService,
      message: "Service added successfully",
    };
  },

  /**
   * Toggle service active status
   */
  async toggleServiceStatus(
    serviceId: string,
  ): Promise<ApiResponse<ServiceOffering>> {
    const servicesJson = await AsyncStorage.getItem(SERVICES_KEY);
    const services: ServiceOffering[] = servicesJson
      ? JSON.parse(servicesJson)
      : [];

    const index = services.findIndex((s) => s.id === serviceId);
    if (index === -1) {
      return { success: false, error: "Service not found" };
    }

    services[index].isActive = !services[index].isActive;
    await AsyncStorage.setItem(SERVICES_KEY, JSON.stringify(services));

    return { success: true, data: services[index] };
  },

  // ========== JOB MANAGEMENT ==========

  /**
   * Get jobs for a business (incoming requests)
   */
  async getJobs(
    businessId: string,
    status?: BusinessJob["status"],
  ): Promise<BusinessJob[]> {
    await this.seedMockData();
    const jobsJson = await AsyncStorage.getItem(JOBS_KEY);
    const jobs: BusinessJob[] = jobsJson ? JSON.parse(jobsJson) : [];

    let filtered = jobs.filter((j) => j.businessId === businessId);
    if (status) {
      filtered = filtered.filter((j) => j.status === status);
    }

    return filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  },

  /**
   * Accept a job request
   */
  async acceptJob(jobId: string): Promise<ApiResponse<BusinessJob>> {
    const jobsJson = await AsyncStorage.getItem(JOBS_KEY);
    const jobs: BusinessJob[] = jobsJson ? JSON.parse(jobsJson) : [];

    const index = jobs.findIndex((j) => j.id === jobId);
    if (index === -1) {
      return { success: false, error: "Job not found" };
    }

    jobs[index].status = "accepted";
    jobs[index].updatedAt = new Date().toISOString();
    await AsyncStorage.setItem(JOBS_KEY, JSON.stringify(jobs));

    return { success: true, data: jobs[index], message: "Job accepted" };
  },

  /**
   * Decline a job request
   */
  async declineJob(
    jobId: string,
    reason?: string,
  ): Promise<ApiResponse<BusinessJob>> {
    const jobsJson = await AsyncStorage.getItem(JOBS_KEY);
    const jobs: BusinessJob[] = jobsJson ? JSON.parse(jobsJson) : [];

    const index = jobs.findIndex((j) => j.id === jobId);
    if (index === -1) {
      return { success: false, error: "Job not found" };
    }

    jobs[index].status = "cancelled";
    jobs[index].updatedAt = new Date().toISOString();
    await AsyncStorage.setItem(JOBS_KEY, JSON.stringify(jobs));

    return { success: true, data: jobs[index], message: "Job declined" };
  },

  /**
   * Assign a team member to a job
   */
  async assignTeamMember(
    jobId: string,
    memberId: string,
  ): Promise<ApiResponse<BusinessJob>> {
    const [jobsJson, teamJson] = await Promise.all([
      AsyncStorage.getItem(JOBS_KEY),
      AsyncStorage.getItem(TEAM_KEY),
    ]);

    const jobs: BusinessJob[] = jobsJson ? JSON.parse(jobsJson) : [];
    const team: TeamMember[] = teamJson ? JSON.parse(teamJson) : [];

    const jobIndex = jobs.findIndex((j) => j.id === jobId);
    if (jobIndex === -1) {
      return { success: false, error: "Job not found" };
    }

    const member = team.find((m) => m.id === memberId);
    if (!member) {
      return { success: false, error: "Team member not found" };
    }

    jobs[jobIndex].assignedTeamMember = memberId;
    jobs[jobIndex].assignedMemberName = member.name;
    jobs[jobIndex].status = "assigned";
    jobs[jobIndex].updatedAt = new Date().toISOString();

    await AsyncStorage.setItem(JOBS_KEY, JSON.stringify(jobs));

    return {
      success: true,
      data: jobs[jobIndex],
      message: `Assigned to ${member.name}`,
    };
  },

  /**
   * Update job status
   */
  async updateJobStatus(
    jobId: string,
    status: BusinessJob["status"],
  ): Promise<ApiResponse<BusinessJob>> {
    const jobsJson = await AsyncStorage.getItem(JOBS_KEY);
    const jobs: BusinessJob[] = jobsJson ? JSON.parse(jobsJson) : [];

    const index = jobs.findIndex((j) => j.id === jobId);
    if (index === -1) {
      return { success: false, error: "Job not found" };
    }

    jobs[index].status = status;
    jobs[index].updatedAt = new Date().toISOString();
    await AsyncStorage.setItem(JOBS_KEY, JSON.stringify(jobs));

    return { success: true, data: jobs[index] };
  },

  // ========== STATISTICS ==========

  /**
   * Get business statistics
   */
  async getStats(businessId: string): Promise<BusinessStats> {
    await this.seedMockData();

    const [jobsJson, teamJson] = await Promise.all([
      AsyncStorage.getItem(JOBS_KEY),
      AsyncStorage.getItem(TEAM_KEY),
    ]);

    const jobs: BusinessJob[] = jobsJson ? JSON.parse(jobsJson) : [];
    const team: TeamMember[] = teamJson ? JSON.parse(teamJson) : [];

    const businessJobs = jobs.filter((j) => j.businessId === businessId);
    const businessTeam = team.filter(
      (m) => m.businessId === businessId && m.isActive,
    );

    const completedJobs = businessJobs.filter((j) => j.status === "completed");
    const activeJobs = businessJobs.filter(
      (j) =>
        j.status === "accepted" ||
        j.status === "assigned" ||
        j.status === "in_progress",
    );

    const totalEarnings = completedJobs.reduce(
      (sum, j) => sum + j.estimatedPrice,
      0,
    );
    const pendingPayouts = activeJobs.reduce(
      (sum, j) => sum + j.estimatedPrice,
      0,
    );

    return {
      totalJobs: businessJobs.length,
      activeJobs: activeJobs.length,
      completedJobs: completedJobs.length,
      totalEarnings,
      pendingPayouts,
      teamSize: businessTeam.length,
      rating: 4.8, // Mock rating
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
    const profileJson = await AsyncStorage.getItem(PROFILE_KEY);
    if (profileJson) {
      return JSON.parse(profileJson);
    }

    // Return default/mock profile if none exists
    const defaultProfile: BusinessProfile = {
      id: businessId,
      businessName: "Surespark Cleaning Services",
      description:
        "Professional home repair and maintenance services. We specialize in electrical, plumbing, and AC repairs with a team of certified technicians.",
      address: "123 Victoria Island, Lagos",
      phone: "+234 800 123 4567",
      email: "[EMAIL_ADDRESS]",
      availability: DEFAULT_AVAILABILITY,
      isVerified: true,
    };

    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(defaultProfile));
    return defaultProfile;
  },

  /**
   * Update business profile
   */
  async updateProfile(
    businessId: string,
    updates: Partial<BusinessProfile>,
  ): Promise<ApiResponse<BusinessProfile>> {
    const currentProfile = await this.getProfile(businessId);
    const updatedProfile = { ...currentProfile, ...updates };

    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(updatedProfile));

    return {
      success: true,
      data: updatedProfile,
      message: "Profile updated successfully",
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
    const currentProfile = await this.getProfile(businessId);

    const updatedProfile: BusinessProfile = {
      ...currentProfile,
      ...data,
      verificationStatus: "in_review",
      isVerified: false, // Remains false until admin approves
    };

    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(updatedProfile));

    return {
      success: true,
      data: updatedProfile,
      message: "Verification submitted successfully",
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
};

export default businessService;
