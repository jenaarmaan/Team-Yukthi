import { CandidateProfile, HiringDrive, Application, AppNotification } from '../types/recruitment';

export const SEED_HIRING_DRIVES: HiringDrive[] = [
  {
    id: 'drive_excelsoft_gse_2026',
    company: 'Excelsoft Technologies',
    title: 'Graduate Software Engineer Hiring Drive 2026',
    role: 'Graduate Software Engineer',
    department: 'Enterprise Learning & Assessment Solutions',
    description: 'Join Excelsoft Technologies to engineer cutting-edge digital learning ecosystems, smart assessment engines, and scalable educational cloud platforms serving 30M+ global learners.',
    locations: ['Mysuru', 'Bengaluru'],
    requiredDegree: ['B.E.', 'B.Tech', 'M.Tech', 'MCA'],
    minimumCgpa: 7.0,
    eligibleCandidateTypes: ['fresher'],
    mandatorySkills: ['Data Structures & Algorithms', 'Java', 'Python', 'SQL'],
    preferredSkills: ['Spring Boot', 'React', 'Cloud Basics'],
    minExperienceMonths: 0,
    registrationDeadline: '2026-11-15T23:59:59',
    hiringDriveDate: '2026-11-20T09:00:00',
    stages: [
      'Registration & Online Screening',
      'Cognitive & Technical Assessment',
      'Technical Interview Round 1 (DSA & System Basics)',
      'Technical Interview Round 2 (Projects & Problem Solving)',
      'HR Discussion & Offer Rollout'
    ],
    isRegistrationOpen: true,
    totalOpenings: 45,
    interviewCapacity: 120,
    currentRegistrations: 114
  },
  {
    id: 'drive_excelsoft_fullstack_2026',
    company: 'Excelsoft Technologies',
    title: 'Full Stack EdTech Engineer (Experienced)',
    role: 'Senior Software Engineer - Full Stack',
    department: 'K-12 & Higher Ed Product Line',
    description: 'Lead architecture of micro-frontends and high-throughput REST/GraphQL APIs for global university learning management frameworks. Drive performance, clean code, and test automation.',
    locations: ['Bengaluru', 'Mysuru', 'Hyderabad'],
    requiredDegree: ['B.E.', 'B.Tech', 'MCA', 'M.S.'],
    minimumCgpa: 6.5,
    eligibleCandidateTypes: ['experienced'],
    mandatorySkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    preferredSkills: ['Docker', 'AWS', 'Redis', 'GraphQL'],
    minExperienceMonths: 24,
    registrationDeadline: '2026-11-10T23:59:59',
    hiringDriveDate: '2026-11-18T10:00:00',
    stages: [
      'Technical Profile Review',
      'Live Coding & Architecture Design',
      'Managerial Round',
      'HR Evaluation'
    ],
    isRegistrationOpen: true,
    totalOpenings: 18,
    interviewCapacity: 50,
    currentRegistrations: 48
  },
  {
    id: 'drive_excelsoft_aiml_2026',
    company: 'Excelsoft Technologies',
    title: 'AI & Adaptive Learning Systems Engineer',
    role: 'AI / Machine Learning Engineer',
    department: 'R&D Innovation Lab',
    description: 'Build predictive knowledge modeling, automated subjective answer evaluation, and generative AI agents for personalized education at scale.',
    locations: ['Hyderabad', 'Bengaluru'],
    requiredDegree: ['B.E.', 'B.Tech', 'M.Tech', 'M.S. in CS/AI'],
    minimumCgpa: 7.5,
    eligibleCandidateTypes: ['fresher', 'experienced'],
    mandatorySkills: ['Python', 'PyTorch', 'Machine Learning', 'NLP'],
    preferredSkills: ['LangChain', 'Vector Databases', 'FastAPI'],
    minExperienceMonths: 0,
    registrationDeadline: '2026-11-25T23:59:59',
    hiringDriveDate: '2026-12-02T09:30:00',
    stages: [
      'Resume & Portfolio Evaluation',
      'Machine Learning Problem Assignment',
      'Technical Deep Dive',
      'Leadership & Culture Alignment'
    ],
    isRegistrationOpen: true,
    totalOpenings: 10,
    interviewCapacity: 30,
    currentRegistrations: 22
  },
  {
    id: 'drive_excelsoft_qa_2026',
    company: 'Excelsoft Technologies',
    title: 'QA Automation & Performance Specialist',
    role: 'SDET / Quality Assurance Engineer',
    department: 'Global Quality Assurance',
    description: 'Design end-to-end automation test harnesses, load testing suites, and CI/CD quality gates for enterprise education SaaS applications.',
    locations: ['Mysuru'],
    requiredDegree: ['B.E.', 'B.Tech', 'BCA', 'MCA'],
    minimumCgpa: 6.5,
    eligibleCandidateTypes: ['experienced'],
    mandatorySkills: ['Selenium', 'Playwright', 'Java', 'API Testing'],
    preferredSkills: ['JMeter', 'Jenkins', 'Postman'],
    minExperienceMonths: 12,
    registrationDeadline: '2026-11-12T23:59:59',
    hiringDriveDate: '2026-11-16T09:00:00',
    stages: [
      'Automated Test Scripting Assessment',
      'Technical Interview - QA Frameworks',
      'HR Final Discussion'
    ],
    isRegistrationOpen: true,
    totalOpenings: 8,
    interviewCapacity: 25,
    currentRegistrations: 21,
    status: 'upcoming'
  },
  {
    id: 'drive_excelsoft_cloud_2025',
    company: 'Excelsoft Technologies',
    title: 'Cloud Infrastructure & Distributed Systems Drive 2025',
    role: 'Cloud DevOps Engineer',
    department: 'Cloud Infrastructure & Reliability Engineering',
    description: 'Completed campus and lateral drive focusing on Kubernetes cluster orchestration, Terraform IaC, AWS cloud architecture, and multi-region microservices resilience.',
    locations: ['Bengaluru', 'Mysuru'],
    requiredDegree: ['B.E.', 'B.Tech', 'M.Tech'],
    minimumCgpa: 6.8,
    eligibleCandidateTypes: ['fresher', 'experienced'],
    mandatorySkills: ['Docker', 'Kubernetes', 'AWS', 'Linux Shell'],
    preferredSkills: ['Terraform', 'Prometheus', 'Go'],
    minExperienceMonths: 0,
    registrationDeadline: '2025-10-01T23:59:59',
    hiringDriveDate: '2025-10-15T09:00:00',
    completedDate: '2025-10-18T18:00:00',
    stages: [
      'Cloud Architecture Screening',
      'Hands-on Containerization Lab',
      'Technical Interview Round 1',
      'Technical Interview Round 2',
      'HR Evaluation & Offer'
    ],
    isRegistrationOpen: false,
    status: 'completed',
    totalOpenings: 25,
    interviewCapacity: 100,
    currentRegistrations: 96,
    selectionStats: {
      totalEvaluated: 89,
      selectedCount: 24,
      rejectedCount: 65,
      offerAcceptanceRate: 92,
      averageScore: 81.4
    }
  },
  {
    id: 'drive_excelsoft_cyber_2025',
    company: 'Excelsoft Technologies',
    title: 'Cybersecurity & Application Hardening Drive 2025',
    role: 'Information Security Analyst',
    department: 'Enterprise Security & Compliance',
    description: 'Completed campus assessment drive for vulnerability assessment, penetration testing, OWASP Top 10 mitigation, and ISO 27001 compliance auditing across EdTech platforms.',
    locations: ['Hyderabad', 'Mysuru'],
    requiredDegree: ['B.E.', 'B.Tech', 'MCA', 'M.S. in InfoSec'],
    minimumCgpa: 7.0,
    eligibleCandidateTypes: ['fresher', 'experienced'],
    mandatorySkills: ['Network Security', 'OWASP', 'Penetration Testing', 'Cryptography'],
    preferredSkills: ['Burp Suite', 'Wireshark', 'Python'],
    minExperienceMonths: 0,
    registrationDeadline: '2025-08-10T23:59:59',
    hiringDriveDate: '2025-08-22T09:30:00',
    completedDate: '2025-08-24T17:30:00',
    stages: [
      'Security CTF Challenge',
      'Technical Panel Round 1',
      'Threat Modeling & Architecture Round',
      'Offer Discussion'
    ],
    isRegistrationOpen: false,
    status: 'completed',
    totalOpenings: 15,
    interviewCapacity: 70,
    currentRegistrations: 68,
    selectionStats: {
      totalEvaluated: 64,
      selectedCount: 14,
      rejectedCount: 50,
      offerAcceptanceRate: 88,
      averageScore: 79.2
    }
  },
  {
    id: 'drive_excelsoft_interns_2025',
    company: 'Excelsoft Technologies',
    title: 'EdTech Summer Engineering Internship Drive 2025',
    role: 'Software Development Intern (6 Months)',
    department: 'Global Learning Ecosystems',
    description: 'Completed university campus drive for 6-month pre-placement interns across full stack web, algorithms, and mobile product engineering with high PPO conversion.',
    locations: ['Mysuru', 'Bengaluru'],
    requiredDegree: ['B.E.', 'B.Tech', 'BCA', 'B.Sc Computer Science'],
    minimumCgpa: 7.2,
    eligibleCandidateTypes: ['fresher'],
    mandatorySkills: ['Core Java', 'JavaScript', 'HTML/CSS', 'Data Structures'],
    preferredSkills: ['React', 'Git', 'MySQL'],
    minExperienceMonths: 0,
    registrationDeadline: '2025-05-25T23:59:59',
    hiringDriveDate: '2025-06-10T09:00:00',
    completedDate: '2025-06-12T19:00:00',
    stages: [
      'Campus Algorithmic Test',
      'Technical Pair Programming Round',
      'Academic Project Presentation',
      'HR Discussion'
    ],
    isRegistrationOpen: false,
    status: 'completed',
    totalOpenings: 35,
    interviewCapacity: 120,
    currentRegistrations: 115,
    selectionStats: {
      totalEvaluated: 107,
      selectedCount: 35,
      rejectedCount: 72,
      offerAcceptanceRate: 97,
      averageScore: 84.6
    }
  }
];

export interface DemoPersona {
  key: string;
  label: string;
  scenarioName: string;
  description: string;
  profile: CandidateProfile;
  applications: Application[];
  notifications: AppNotification[];
}

export const DEMO_PERSONAS: Record<string, DemoPersona> = {
  confirmed: {
    key: 'confirmed',
    label: 'Rohan Sharma (Confirmed Slot)',
    scenarioName: 'Scenario A: Confirmed Interview with QR Pass',
    description: 'Fresher with confirmed interview slot at Excelsoft Mysuru campus, active QR code & check-in ready.',
    profile: {
      id: 'cand_rohan_sharma',
      userId: 'user_rohan_01',
      fullName: 'Rohan Sharma',
      email: 'rohan.sharma@example.com',
      phone: '+91 98765 43210',
      candidateType: 'fresher',
      currentLocation: 'Hyderabad',
      preferredLocations: ['Hyderabad', 'Mysuru', 'Bengaluru'],
      education: {
        institution: 'National Institute of Engineering (NIE), Mysuru',
        degree: 'B.E.',
        branch: 'Computer Science and Engineering',
        graduationYear: 2026,
        cgpa: 8.42,
        verified: true
      },
      workExperience: [],
      skills: [
        { id: 's1', name: 'Java', category: 'programming', verificationLevel: 'assessment_verified', rating: 4 },
        { id: 's2', name: 'Data Structures & Algorithms', category: 'programming', verificationLevel: 'assessment_verified', rating: 4 },
        { id: 's3', name: 'Python', category: 'programming', verificationLevel: 'resume_extracted', rating: 3 },
        { id: 's4', name: 'SQL', category: 'database', verificationLevel: 'assessment_verified', rating: 4 },
        { id: 's5', name: 'Spring Boot', category: 'framework', verificationLevel: 'self_declared', rating: 3 },
        { id: 's6', name: 'Git & GitHub', category: 'tools', verificationLevel: 'resume_extracted', rating: 4 }
      ],
      certifications: ['Oracle Certified Associate, Java SE 8 Programmer', 'HackerRank Problem Solving (Gold)'],
      preferredJobRoles: ['Graduate Software Engineer', 'Junior Backend Developer'],
      profileCompletionPercentage: 100,
      verificationStatus: 'verified',
      resume: {
        fileName: 'Rohan_Sharma_Resume_2026.pdf',
        uploadedAt: '2026-10-25T11:20:00',
        fileSize: '412 KB',
        parsedData: {
          summary: 'Motivated final-year CS graduate proficient in Java, algorithms, and relational databases with 2 academic project highlights.',
          detectedSkills: ['Java', 'Python', 'SQL', 'Git', 'Spring Boot', 'Data Structures'],
          educationDetected: 'B.E. Computer Science, NIE Mysuru, CGPA 8.42',
          yearsOfExperience: 0
        }
      }
    },
    applications: [
      {
        id: 'app_rohan_gse_01',
        candidateId: 'cand_rohan_sharma',
        hiringDriveId: 'drive_excelsoft_gse_2026',
        hiringDriveTitle: 'Graduate Software Engineer Hiring Drive 2026',
        company: 'Excelsoft Technologies',
        role: 'Graduate Software Engineer',
        appliedLocation: 'Mysuru',
        appliedDate: '2026-10-26T14:30:00',
        status: 'confirmed',
        stages: [
          { step: 1, title: 'Registration', description: 'Application submitted & verified', status: 'completed', date: '26 Oct 2026' },
          { step: 2, title: 'Profile Verification', description: 'Degree & CGPA eligibility approved', status: 'completed', date: '27 Oct 2026' },
          { step: 3, title: 'Eligibility Check', description: 'Met mandatory skills criteria', status: 'completed', date: '27 Oct 2026' },
          { step: 4, title: 'Interview Allocation', description: 'Slot allocated by HR Scheduling System', status: 'current', date: '28 Oct 2026' },
          { step: 5, title: 'Interview Attendance', description: 'Report at venue & scan QR pass', status: 'pending' },
          { step: 6, title: 'Interview Result', description: 'Technical & HR rounds outcome', status: 'pending' }
        ],
        interviewSlot: {
          id: 'slot_mysuru_panel_04',
          hiringDriveId: 'drive_excelsoft_gse_2026',
          date: 'Saturday, Nov 20, 2026',
          time: '10:30 AM - 11:30 AM IST',
          reportingTime: '10:00 AM IST (30 mins prior)',
          location: 'Mysuru Development Center',
          roomOrPanel: 'Panel 4 - Brahmaputra Block, 2nd Floor',
          venueAddress: 'Excelsoft Technologies Pvt. Ltd., 1B, Hootagalli Industrial Area, Mysuru, Karnataka 570018',
          instructions: [
            'Carry a government-issued photo ID (Aadhaar / Voter ID / Passport) and 2 printed copies of your resume.',
            'Maintain formal business attire.',
            'Present your NIYOJAN In-App QR Pass at the reception desk for instant biometric/scanner attendance check-in.',
            'Report strictly by 10:00 AM. Late arrival by more than 15 minutes may forfeit the scheduled slot under drive policy.'
          ],
          qrToken: 'NIYOJAN_ATTEND_ROHAN_GSE_2026_MYS_4029',
          otpCode: '839201',
          isCheckInOpen: true,
          attendanceVerified: false
        },
        statusHistory: [
          { status: 'submitted', timestamp: '2026-10-26T14:30:00', note: 'Application registered for Graduate Software Engineer' },
          { status: 'eligible', timestamp: '2026-10-27T10:15:00', note: 'Automated eligibility engine validated CGPA >= 7.0 and CS Degree' },
          { status: 'confirmed', timestamp: '2026-10-28T09:00:00', note: 'Assigned to Technical Interview Panel 4 at Mysuru campus' }
        ]
      }
    ],
    notifications: [
      {
        id: 'notif_1',
        candidateId: 'cand_rohan_sharma',
        type: 'interview_allocated',
        title: 'Interview Slot Confirmed: Panel 4, Mysuru',
        message: 'Your interview for Graduate Software Engineer at Excelsoft Technologies is scheduled for Nov 20, 2026 at 10:30 AM.',
        timestamp: '2 hours ago',
        isRead: false,
        actionRoute: { tab: 'applications', targetId: 'app_rohan_gse_01' }
      },
      {
        id: 'notif_2',
        candidateId: 'cand_rohan_sharma',
        type: 'eligibility_result',
        title: 'Eligibility Verified for Excelsoft Drive',
        message: 'Your academic credentials and technical skills meet all prerequisites for the Graduate Software Engineer drive.',
        timestamp: '1 day ago',
        isRead: true,
        actionRoute: { tab: 'applications', targetId: 'app_rohan_gse_01' }
      }
    ]
  },

  waitlisted: {
    key: 'waitlisted',
    label: 'Ananya Iyer (Waitlisted #4)',
    scenarioName: 'Scenario B: Dynamic Waitlist Queue',
    description: 'Candidate qualified for interview but capacity reached peak; placed at active Waitlist Position #4.',
    profile: {
      id: 'cand_ananya_iyer',
      userId: 'user_ananya_02',
      fullName: 'Ananya Iyer',
      email: 'ananya.iyer@example.com',
      phone: '+91 97654 32109',
      candidateType: 'fresher',
      currentLocation: 'Chennai',
      preferredLocations: ['Bengaluru', 'Mysuru'],
      education: {
        institution: 'PSG College of Technology, Coimbatore',
        degree: 'B.Tech',
        branch: 'Information Technology',
        graduationYear: 2026,
        cgpa: 7.92,
        verified: true
      },
      workExperience: [],
      skills: [
        { id: 's10', name: 'Java', category: 'programming', verificationLevel: 'assessment_verified', rating: 4 },
        { id: 's11', name: 'SQL', category: 'database', verificationLevel: 'assessment_verified', rating: 3 },
        { id: 's12', name: 'Data Structures & Algorithms', category: 'programming', verificationLevel: 'resume_extracted', rating: 3 },
        { id: 's13', name: 'React', category: 'framework', verificationLevel: 'self_declared', rating: 3 }
      ],
      certifications: ['AWS Certified Cloud Practitioner'],
      preferredJobRoles: ['Graduate Software Engineer', 'Cloud Trainee'],
      profileCompletionPercentage: 92,
      verificationStatus: 'verified',
      resume: {
        fileName: 'Ananya_Iyer_CV.pdf',
        uploadedAt: '2026-10-27T09:15:00',
        fileSize: '380 KB',
        parsedData: {
          summary: 'B.Tech IT graduate with hands-on coursework in cloud platforms and relational databases.',
          detectedSkills: ['Java', 'SQL', 'AWS', 'React'],
          educationDetected: 'B.Tech IT, PSG Tech, CGPA 7.92',
          yearsOfExperience: 0
        }
      }
    },
    applications: [
      {
        id: 'app_ananya_waitlist_02',
        candidateId: 'cand_ananya_iyer',
        hiringDriveId: 'drive_excelsoft_gse_2026',
        hiringDriveTitle: 'Graduate Software Engineer Hiring Drive 2026',
        company: 'Excelsoft Technologies',
        role: 'Graduate Software Engineer',
        appliedLocation: 'Mysuru',
        appliedDate: '2026-10-27T16:00:00',
        status: 'waitlisted',
        stages: [
          { step: 1, title: 'Registration', description: 'Application registered', status: 'completed', date: '27 Oct 2026' },
          { step: 2, title: 'Profile Verification', description: 'Academic records verified', status: 'completed', date: '28 Oct 2026' },
          { step: 3, title: 'Eligibility Check', description: 'Qualified for technical interview', status: 'completed', date: '28 Oct 2026' },
          { step: 4, title: 'Interview Allocation', description: 'Interview capacity reached; placed on dynamic waitlist', status: 'current', date: '28 Oct 2026' },
          { step: 5, title: 'Interview Attendance', description: 'Pending slot promotion', status: 'pending' },
          { step: 6, title: 'Interview Result', description: 'Outcome pending', status: 'pending' }
        ],
        waitlistInfo: {
          id: 'wl_ananya_902',
          hiringDriveId: 'drive_excelsoft_gse_2026',
          position: 4,
          totalInWaitlist: 16,
          status: 'active',
          lastUpdatedAt: 'Today at 09:15 AM',
          expectedNextSteps: 'Slots are dynamically released if confirmed candidates reschedule or decline. You will be automatically notified if promoted or allocated to Batch 2.',
          tentativeFutureDate: 'Dec 05, 2026 (Batch 2 Tentative)'
        },
        statusHistory: [
          { status: 'submitted', timestamp: '2026-10-27T16:00:00', note: 'Submitted application' },
          { status: 'eligible', timestamp: '2026-10-28T10:00:00', note: 'Eligibility confirmed' },
          { status: 'waitlisted', timestamp: '2026-10-28T11:30:00', note: 'All 120 primary slots allocated; assigned to waitlist queue position #4' }
        ]
      }
    ],
    notifications: [
      {
        id: 'notif_wl_1',
        candidateId: 'cand_ananya_iyer',
        type: 'waitlist_update',
        title: 'Application Update: Waitlist Position #4',
        message: 'You have been placed at position #4 on the waitlist for the Graduate Software Engineer drive. Read policy guidelines.',
        timestamp: '3 hours ago',
        isRead: false,
        actionRoute: { tab: 'applications', targetId: 'app_ananya_waitlist_02' }
      }
    ]
  },

  standby: {
    key: 'standby',
    label: 'Vikramaditya Rao (Standby Candidate)',
    scenarioName: 'Scenario C: Proactive Standby Invitation',
    description: 'Candidate placed on proactive standby pool; needs to accept or decline the standby availability invitation.',
    profile: {
      id: 'cand_vikram_rao',
      userId: 'user_vikram_03',
      fullName: 'Vikramaditya Rao',
      email: 'vikram.rao@example.com',
      phone: '+91 91234 56789',
      candidateType: 'experienced',
      currentLocation: 'Bengaluru',
      preferredLocations: ['Bengaluru', 'Hyderabad'],
      education: {
        institution: 'PES University, Bengaluru',
        degree: 'B.Tech',
        branch: 'Computer Science',
        graduationYear: 2023,
        cgpa: 8.1,
        verified: true
      },
      workExperience: [
        {
          organization: 'CogniFlow Systems',
          jobTitle: 'Software Engineer',
          durationMonths: 28,
          startDate: '2023-07-01',
          isCurrent: true,
          description: 'Engineered high-concurrency microservices with Node.js and TypeScript. Built responsive React dashboards.',
          relevantSkills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL']
        }
      ],
      skills: [
        { id: 's20', name: 'React', category: 'framework', verificationLevel: 'hr_verified', rating: 5 },
        { id: 's21', name: 'TypeScript', category: 'programming', verificationLevel: 'assessment_verified', rating: 4 },
        { id: 's22', name: 'Node.js', category: 'framework', verificationLevel: 'assessment_verified', rating: 4 },
        { id: 's23', name: 'PostgreSQL', category: 'database', verificationLevel: 'resume_extracted', rating: 4 }
      ],
      certifications: ['AWS Certified Solutions Architect - Associate'],
      preferredJobRoles: ['Senior Software Engineer', 'Full Stack Developer'],
      profileCompletionPercentage: 96,
      verificationStatus: 'verified',
      resume: {
        fileName: 'Vikram_Rao_Senior_FullStack.pdf',
        uploadedAt: '2026-10-24T18:00:00',
        fileSize: '512 KB',
        parsedData: {
          summary: 'Full Stack engineer with 2+ years of production experience in React, Node.js, and cloud deployments.',
          detectedSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
          educationDetected: 'B.Tech CSE, PES University, 2023',
          yearsOfExperience: 2.3
        }
      }
    },
    applications: [
      {
        id: 'app_vikram_standby_03',
        candidateId: 'cand_vikram_rao',
        hiringDriveId: 'drive_excelsoft_fullstack_2026',
        hiringDriveTitle: 'Full Stack EdTech Engineer (Experienced)',
        company: 'Excelsoft Technologies',
        role: 'Senior Software Engineer - Full Stack',
        appliedLocation: 'Bengaluru',
        appliedDate: '2026-10-26T12:00:00',
        status: 'standby',
        stages: [
          { step: 1, title: 'Registration', description: 'Application submitted', status: 'completed', date: '26 Oct 2026' },
          { step: 2, title: 'Profile Verification', description: 'Experience & skills verified', status: 'completed', date: '27 Oct 2026' },
          { step: 3, title: 'Eligibility Check', description: 'Passed technical criteria', status: 'completed', date: '27 Oct 2026' },
          { step: 4, title: 'Standby Pool Allocation', description: 'Designated for standby priority', status: 'current', date: '28 Oct 2026' },
          { step: 5, title: 'Interview Attendance', description: 'Awaiting replacement slot offer', status: 'pending' },
          { step: 6, title: 'Interview Result', description: 'Pending interview', status: 'pending' }
        ],
        standbyInfo: {
          id: 'std_inv_vikram_811',
          hiringDriveId: 'drive_excelsoft_fullstack_2026',
          company: 'Excelsoft Technologies',
          jobRole: 'Senior Software Engineer - Full Stack',
          location: 'Bengaluru Innovation Hub, Manyata Tech Park',
          invitationStatus: 'pending_response',
          invitedAt: '2026-10-29T10:00:00',
          responseDeadline: '2026-11-02T18:00:00',
          potentialSlotDate: 'Nov 18, 2026 (10:00 AM - 04:00 PM Window)'
        },
        statusHistory: [
          { status: 'submitted', timestamp: '2026-10-26T12:00:00', note: 'Applied for Full Stack Engineer' },
          { status: 'eligible', timestamp: '2026-10-27T11:00:00', note: 'Profile and 2+ years experience ratified' },
          { status: 'standby', timestamp: '2026-10-29T10:00:00', note: 'Extended proactive standby invitation for Bengaluru hiring drive' }
        ]
      }
    ],
    notifications: [
      {
        id: 'notif_sb_1',
        candidateId: 'cand_vikram_rao',
        type: 'standby_invitation',
        title: 'Action Required: Standby Invitation from Excelsoft',
        message: 'You have been invited to join the priority Standby Pool for Full Stack Engineer in Bengaluru. Please confirm your availability.',
        timestamp: '1 hour ago',
        isRead: false,
        actionRoute: { tab: 'applications', targetId: 'app_vikram_standby_03' }
      }
    ]
  },

  replacement_offered: {
    key: 'replacement_offered',
    label: 'Sneha Reddy (Replacement Slot Offered!)',
    scenarioName: 'Scenario C/D: Urgent Slot Replacement',
    description: 'Standby candidate who just received an urgent vacant interview slot notification with a ticking countdown.',
    profile: {
      id: 'cand_sneha_reddy',
      userId: 'user_sneha_04',
      fullName: 'Sneha Reddy',
      email: 'sneha.reddy@example.com',
      phone: '+91 93456 78901',
      candidateType: 'experienced',
      currentLocation: 'Hyderabad',
      preferredLocations: ['Hyderabad', 'Bengaluru'],
      education: {
        institution: 'JNTU Hyderabad',
        degree: 'B.Tech',
        branch: 'Computer Science & Engineering',
        graduationYear: 2023,
        cgpa: 8.35,
        verified: true
      },
      workExperience: [
        {
          organization: 'Apex Cloud Solutions',
          jobTitle: 'Backend Engineer',
          durationMonths: 26,
          startDate: '2023-08-01',
          isCurrent: true,
          description: 'Designed distributed database architectures with PostgreSQL and Node.js.',
          relevantSkills: ['Node.js', 'PostgreSQL', 'TypeScript', 'Docker']
        }
      ],
      skills: [
        { id: 's30', name: 'TypeScript', category: 'programming', verificationLevel: 'assessment_verified', rating: 4 },
        { id: 's31', name: 'Node.js', category: 'framework', verificationLevel: 'assessment_verified', rating: 5 },
        { id: 's32', name: 'PostgreSQL', category: 'database', verificationLevel: 'assessment_verified', rating: 4 },
        { id: 's33', name: 'React', category: 'framework', verificationLevel: 'resume_extracted', rating: 4 }
      ],
      certifications: ['HashiCorp Certified Terraform Associate'],
      preferredJobRoles: ['Full Stack Engineer', 'Backend Engineer'],
      profileCompletionPercentage: 98,
      verificationStatus: 'verified',
      resume: {
        fileName: 'Sneha_Reddy_Backend_CV.pdf',
        uploadedAt: '2026-10-23T14:00:00',
        fileSize: '460 KB',
        parsedData: {
          summary: 'Software engineer experienced in cloud microservices and scalable REST APIs.',
          detectedSkills: ['Node.js', 'PostgreSQL', 'TypeScript', 'Docker', 'React'],
          educationDetected: 'B.Tech CSE, JNTU Hyderabad, 2023',
          yearsOfExperience: 2.2
        }
      }
    },
    applications: [
      {
        id: 'app_sneha_replacement_04',
        candidateId: 'cand_sneha_reddy',
        hiringDriveId: 'drive_excelsoft_fullstack_2026',
        hiringDriveTitle: 'Full Stack EdTech Engineer (Experienced)',
        company: 'Excelsoft Technologies',
        role: 'Senior Software Engineer - Full Stack',
        appliedLocation: 'Bengaluru',
        appliedDate: '2026-10-25T10:00:00',
        status: 'standby',
        stages: [
          { step: 1, title: 'Registration', description: 'Application registered', status: 'completed', date: '25 Oct 2026' },
          { step: 2, title: 'Profile Verification', description: 'Verified experience', status: 'completed', date: '26 Oct 2026' },
          { step: 3, title: 'Eligibility Check', description: 'Eligible for senior role', status: 'completed', date: '26 Oct 2026' },
          { step: 4, title: 'Replacement Offer Active', description: 'Candidate dropout opened an urgent slot for you!', status: 'current', date: '30 Oct 2026' },
          { step: 5, title: 'Interview Attendance', description: 'Confirm slot to receive QR pass', status: 'pending' },
          { step: 6, title: 'Interview Result', description: 'Pending interview', status: 'pending' }
        ],
        standbyInfo: {
          id: 'std_sneha_993',
          hiringDriveId: 'drive_excelsoft_fullstack_2026',
          company: 'Excelsoft Technologies',
          jobRole: 'Senior Software Engineer - Full Stack',
          location: 'Excelsoft Bengaluru Innovation Center, Manyata Tech Park',
          invitationStatus: 'replacement_offered',
          invitedAt: '2026-10-28T09:00:00',
          responseDeadline: '2026-10-31T18:00:00',
          replacementSlot: {
            slotId: 'slot_repl_bengaluru_08',
            date: 'Thursday, Nov 18, 2026',
            time: '02:00 PM - 03:00 PM IST',
            venue: 'Panel 2, Manyata Tech Park Campus, Bengaluru',
            confirmationDeadline: '2026-10-30T18:00:00'
          }
        },
        statusHistory: [
          { status: 'submitted', timestamp: '2026-10-25T10:00:00', note: 'Application filed' },
          { status: 'standby', timestamp: '2026-10-28T09:00:00', note: 'Joined Standby pool with accepted status' },
          { status: 'standby', timestamp: '2026-10-30T04:15:00', note: 'URGENT: A confirmed slot became vacant. Replacement opportunity offered!' }
        ]
      }
    ],
    notifications: [
      {
        id: 'notif_repl_urgent',
        candidateId: 'cand_sneha_reddy',
        type: 'replacement_opportunity',
        title: 'URGENT: Vacant Interview Slot Offered!',
        message: 'A candidate dropped out for Nov 18 in Bengaluru. You have been offered this interview slot. Confirm before deadline!',
        timestamp: '15 mins ago',
        isRead: false,
        actionRoute: { tab: 'applications', targetId: 'app_sneha_replacement_04' }
      }
    ]
  },

  absence_pending: {
    key: 'absence_pending',
    label: 'Karthik Nair (Missed Interview - Review Pending)',
    scenarioName: 'Scenario D: Experienced Absence Explanation',
    description: 'Experienced candidate missed interview due to medical emergency; explanation submitted with doctor note, awaiting HR ratification.',
    profile: {
      id: 'cand_karthik_nair',
      userId: 'user_karthik_05',
      fullName: 'Karthik Nair',
      email: 'karthik.nair@example.com',
      phone: '+91 94567 89012',
      candidateType: 'experienced',
      currentLocation: 'Mysuru',
      preferredLocations: ['Mysuru', 'Bengaluru'],
      education: {
        institution: 'Sri Jayachamarajendra College of Engineering (SJCE), Mysuru',
        degree: 'B.E.',
        branch: 'Electronics and Communication',
        graduationYear: 2022,
        cgpa: 7.78,
        verified: true
      },
      workExperience: [
        {
          organization: 'Apex Testing Systems',
          jobTitle: 'QA Automation Engineer',
          durationMonths: 32,
          startDate: '2022-09-01',
          isCurrent: true,
          description: 'Developed automated Cypress and Playwright test suites for cloud products.',
          relevantSkills: ['Playwright', 'Selenium', 'Java', 'API Testing']
        }
      ],
      skills: [
        { id: 's40', name: 'Selenium', category: 'tools', verificationLevel: 'assessment_verified', rating: 4 },
        { id: 's41', name: 'Playwright', category: 'tools', verificationLevel: 'assessment_verified', rating: 5 },
        { id: 's42', name: 'Java', category: 'programming', verificationLevel: 'hr_verified', rating: 4 },
        { id: 's43', name: 'API Testing', category: 'tools', verificationLevel: 'resume_extracted', rating: 4 }
      ],
      certifications: ['ISTQB Certified Tester Foundation Level'],
      preferredJobRoles: ['QA Automation Specialist', 'SDET'],
      profileCompletionPercentage: 94,
      verificationStatus: 'verified',
      resume: {
        fileName: 'Karthik_Nair_SDET.pdf',
        uploadedAt: '2026-10-20T10:00:00',
        fileSize: '440 KB',
        parsedData: {
          summary: 'QA Automation Engineer with 2.8 years specializing in Playwright, Selenium, and CI/CD quality testing.',
          detectedSkills: ['Playwright', 'Selenium', 'Java', 'API Testing', 'Postman'],
          educationDetected: 'B.E. ECE, SJCE Mysuru, 2022',
          yearsOfExperience: 2.7
        }
      }
    },
    applications: [
      {
        id: 'app_karthik_absence_05',
        candidateId: 'cand_karthik_nair',
        hiringDriveId: 'drive_excelsoft_qa_2026',
        hiringDriveTitle: 'QA Automation & Performance Specialist',
        company: 'Excelsoft Technologies',
        role: 'SDET / Quality Assurance Engineer',
        appliedLocation: 'Mysuru',
        appliedDate: '2026-10-22T11:00:00',
        status: 'under_review',
        stages: [
          { step: 1, title: 'Registration', description: 'Application filed', status: 'completed', date: '22 Oct 2026' },
          { step: 2, title: 'Profile Verification', description: 'Experience verified', status: 'completed', date: '23 Oct 2026' },
          { step: 3, title: 'Eligibility Check', description: 'Prerequisites cleared', status: 'completed', date: '23 Oct 2026' },
          { step: 4, title: 'Interview Allocation', description: 'Allocated slot for Oct 29', status: 'completed', date: '24 Oct 2026' },
          { step: 5, title: 'Absence Review', description: 'Interview missed. Candidate submitted medical explanation. HR decision pending.', status: 'current', date: '29 Oct 2026' },
          { step: 6, title: 'Recruitment Outcome', description: 'Pending HR absence ratification', status: 'pending' }
        ],
        absenceRecord: {
          id: 'abs_karthik_771',
          applicationId: 'app_karthik_absence_05',
          hiringDriveId: 'drive_excelsoft_qa_2026',
          interviewSlotId: 'slot_qa_oct29_02',
          candidateType: 'experienced',
          missedDate: '2026-10-29T10:00:00',
          deadlineForExplanation: '2026-10-31T10:00:00',
          status: 'explanation_submitted',
          explanationReason: 'Severe acute food poisoning with high fever on the morning of the interview, requiring urgent clinical consultation at Apollo Clinic Mysuru.',
          supportingDocName: 'Medical_Consultation_Certificate_Apollo_Mysuru.pdf',
          supportingDocUrl: '#',
          submittedAt: '2026-10-29T15:20:00',
          hrReviewNotes: 'Under review by Excelsoft Talent Acquisition Panel (Panel Lead: Mr. S. Kulkarni).'
        },
        statusHistory: [
          { status: 'confirmed', timestamp: '2026-10-24T12:00:00', note: 'Slot scheduled for Oct 29' },
          { status: 'under_review', timestamp: '2026-10-29T11:00:00', note: 'Interview missed; explanation submitted by candidate with supporting document' }
        ]
      }
    ],
    notifications: [
      {
        id: 'notif_abs_1',
        candidateId: 'cand_karthik_nair',
        type: 'absence_policy_alert',
        title: 'Absence Explanation Submitted - Under HR Review',
        message: 'Your absence justification and medical document have been submitted. The HR panel will review within 24 business hours.',
        timestamp: 'Yesterday at 3:30 PM',
        isRead: false,
        actionRoute: { tab: 'applications', targetId: 'app_karthik_absence_05' }
      }
    ]
  },

  blocked: {
    key: 'blocked',
    label: 'Deepak Verma (Candidate Blocked)',
    scenarioName: 'Scenario E: Blocked Due to Unexplained Absence',
    description: 'Experienced candidate missed interview and failed to submit justification within 48h deadline. Blocked under policy.',
    profile: {
      id: 'cand_deepak_verma',
      userId: 'user_deepak_06',
      fullName: 'Deepak Verma',
      email: 'deepak.verma@example.com',
      phone: '+91 95678 90123',
      candidateType: 'experienced',
      currentLocation: 'Hyderabad',
      preferredLocations: ['Hyderabad', 'Bengaluru'],
      education: {
        institution: 'Osmania University, Hyderabad',
        degree: 'B.E.',
        branch: 'Information Technology',
        graduationYear: 2021,
        cgpa: 7.2,
        verified: true
      },
      workExperience: [
        {
          organization: 'Apex IT Services',
          jobTitle: 'Backend Developer',
          durationMonths: 38,
          startDate: '2021-08-01',
          isCurrent: true,
          description: 'Maintained enterprise databases and Java microservices.',
          relevantSkills: ['Java', 'SQL', 'Spring Boot']
        }
      ],
      skills: [
        { id: 's50', name: 'Java', category: 'programming', verificationLevel: 'resume_extracted', rating: 4 },
        { id: 's51', name: 'SQL', category: 'database', verificationLevel: 'self_declared', rating: 3 }
      ],
      certifications: [],
      preferredJobRoles: ['Backend Developer'],
      profileCompletionPercentage: 85,
      verificationStatus: 'action_required',
      resume: {
        fileName: 'Deepak_Verma_Resume.pdf',
        uploadedAt: '2026-10-15T09:00:00',
        fileSize: '320 KB',
        parsedData: {
          summary: 'Software developer with 3 years background in Java and SQL.',
          detectedSkills: ['Java', 'SQL', 'Spring Boot'],
          educationDetected: 'B.E. IT, Osmania University, 2021',
          yearsOfExperience: 3.1
        }
      }
    },
    applications: [
      {
        id: 'app_deepak_blocked_06',
        candidateId: 'cand_deepak_verma',
        hiringDriveId: 'drive_excelsoft_fullstack_2026',
        hiringDriveTitle: 'Full Stack EdTech Engineer (Experienced)',
        company: 'Excelsoft Technologies',
        role: 'Senior Software Engineer - Full Stack',
        appliedLocation: 'Bengaluru',
        appliedDate: '2026-10-16T10:00:00',
        status: 'blocked',
        stages: [
          { step: 1, title: 'Registration', description: 'Application filed', status: 'completed', date: '16 Oct 2026' },
          { step: 2, title: 'Profile Verification', description: 'Verified', status: 'completed', date: '17 Oct 2026' },
          { step: 3, title: 'Eligibility Check', description: 'Passed', status: 'completed', date: '17 Oct 2026' },
          { step: 4, title: 'Interview Allocation', description: 'Slot scheduled for Oct 22', status: 'completed', date: '18 Oct 2026' },
          { step: 5, title: 'Interview Attendance', description: 'Candidate was absent without prior notice', status: 'completed', date: '22 Oct 2026' },
          { step: 6, title: 'Recruitment Policy Decision', description: 'Blocked due to unratified no-show exceeding 48h deadline', status: 'completed', date: '25 Oct 2026' }
        ],
        absenceRecord: {
          id: 'abs_deepak_099',
          applicationId: 'app_deepak_blocked_06',
          hiringDriveId: 'drive_excelsoft_fullstack_2026',
          interviewSlotId: 'slot_deepak_oct22',
          candidateType: 'experienced',
          missedDate: '2026-10-22T10:00:00',
          deadlineForExplanation: '2026-10-24T10:00:00',
          status: 'blocked',
          hrReviewNotes: 'Candidate did not attend interview on Oct 22 and submitted no explanation within the mandatory 48-hour policy period. Candidate status set to BLOCKED across ongoing hiring drives.'
        },
        rejectionReason: 'Absence policy breach: No response or explanation submitted within 48 hours of scheduled interview slot.',
        statusHistory: [
          { status: 'confirmed', timestamp: '2026-10-18T10:00:00', note: 'Slot allocated for Oct 22' },
          { status: 'blocked', timestamp: '2026-10-25T00:01:00', note: 'Automated policy rule: 48-hour absence explanation window lapsed without submission.' }
        ]
      }
    ],
    notifications: [
      {
        id: 'notif_blk_1',
        candidateId: 'cand_deepak_verma',
        type: 'absence_decision',
        title: 'Account Status: Blocked for Recruitment Drives',
        message: 'Due to an unexplained absence on Oct 22 without submission of justification within 48 hours, your profile is blocked as per recruitment policy.',
        timestamp: '5 days ago',
        isRead: true,
        actionRoute: { tab: 'applications', targetId: 'app_deepak_blocked_06' }
      }
    ]
  }
};
