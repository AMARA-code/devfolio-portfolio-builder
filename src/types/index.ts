export interface Profile {
    id: string
    user_id: string
    username: string
    full_name: string
    bio: string
    avatar_url: string
    location: string
    email: string
    website: string
    github_url: string
    linkedin_url: string
    twitter_url: string
    template: 'minimal' | 'dark' | 'creative'
    is_published: boolean
    created_at: string
  }
  
  export interface Skill {
    id: string
    profile_id: string
    name: string
    category: 'Frontend' | 'Backend' | 'Tools' | 'Database'
    level: 'Beginner' | 'Intermediate' | 'Expert'
  }
  
  export interface Project {
    id: string
    profile_id: string
    title: string
    description: string
    thumbnail_url: string
    live_url: string
    github_url: string
    tech_stack: string[]
    featured: boolean
    order_index: number
  }
  
  export interface Experience {
    id: string
    profile_id: string
    company: string
    role: string
    start_date: string
    end_date: string
    is_current: boolean
    description: string
    company_logo_url: string
  }
  
  export interface Education {
    id: string
    profile_id: string
    institution: string
    degree: string
    field: string
    start_year: string
    end_year: string
  }
  
  export interface PortfolioData extends Profile {
    skills: Skill[]
    projects: Project[]
    experience: Experience[]
    education: Education[]
  }
  
  export interface OnboardingData {
    personal: {
      username: string
      full_name: string
      bio: string
      location: string
      email: string
      website: string
      github_url: string
      linkedin_url: string
      twitter_url: string
    }
    skills: Omit<Skill, 'id' | 'profile_id'>[]
    projects: Omit<Project, 'id' | 'profile_id'>[]
    experience: Omit<Experience, 'id' | 'profile_id'>[]
    education: Omit<Education, 'id' | 'profile_id'>[]
    template: 'minimal' | 'dark' | 'creative'
  }