import mongoose, { Document, Schema } from "mongoose";

export interface IResume extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  template: string;
  content: {
    personal: {
      name?: string;
      email?: string;
      phone?: string;
      location?: string;
      website?: string;
      linkedin?: string;
      github?: string;
    };
    summary?: {
      text?: string;
    };
    experience?: Array<{
      company?: string;
      position?: string;
      location?: string;
      startDate?: Date;
      endDate?: Date;
      current?: boolean;
      description?: string;
      achievements?: string[];
    }>;
    education?: Array<{
      institution?: string;
      degree?: string;
      fieldOfStudy?: string;
      location?: string;
      startDate?: Date;
      endDate?: Date;
      current?: boolean;
      description?: string;
      gpa?: string;
    }>;
    skills?: {
      categories?: Array<{
        name?: string;
        skills?: Array<{
          name?: string;
          level?: number;
        }>;
      }>;
      keywords?: string[];
    };
    projects?: Array<{
      title?: string;
      description?: string;
      startDate?: Date;
      endDate?: Date;
      current?: boolean;
      url?: string;
      technologies?: string[];
    }>;
    certifications?: Array<{
      name?: string;
      issuer?: string;
      date?: Date;
      expiryDate?: Date;
      credentialID?: string;
      url?: string;
    }>;
    languages?: Array<{
      language?: string;
      proficiency?: "Native" | "Fluent" | "Advanced" | "Intermediate" | "Basic";
    }>;
    customSections?: Array<{
      title?: string;
      content?: string;
    }>;
  };
  layout?: {
    sectionOrder?: string[];
    visibleSections?: Map<string, boolean>;
  };
  style?: {
    colors?: {
      primary?: string;
      secondary?: string;
      accent?: string;
    };
    fontSize?: "small" | "medium" | "large";
    fontFamily?: string;
    spacing?: "compact" | "normal" | "spacious";
  };
  atsData?: {
    lastScore?: number;
    targetJobTitle?: string;
    jobDescription?: string;
    keywordMatches?: string[];
    missedKeywords?: string[];
    suggestions?: string[];
    lastAnalysis?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    template: {
      type: String,
      required: true,
      default: "professional",
    },
    content: {
      personal: {
        name: String,
        email: String,
        phone: String,
        location: String,
        website: String,
        linkedin: String,
        github: String,
      },
      summary: {
        text: String,
      },
      experience: [
        {
          company: String,
          position: String,
          location: String,
          startDate: Date,
          endDate: Date,
          current: {
            type: Boolean,
            default: false,
          },
          description: String,
          achievements: [String],
        },
      ],
      education: [
        {
          institution: String,
          degree: String,
          fieldOfStudy: String,
          location: String,
          startDate: Date,
          endDate: Date,
          current: {
            type: Boolean,
            default: false,
          },
          description: String,
          gpa: String,
        },
      ],
      skills: {
        categories: [
          {
            name: String,
            skills: [
              {
                name: String,
                level: {
                  type: Number,
                  min: 1,
                  max: 5,
                  default: 3,
                },
              },
            ],
          },
        ],
        keywords: [String],
      },
      projects: [
        {
          title: String,
          description: String,
          startDate: Date,
          endDate: Date,
          current: {
            type: Boolean,
            default: false,
          },
          url: String,
          technologies: [String],
        },
      ],
      certifications: [
        {
          name: String,
          issuer: String,
          date: Date,
          expiryDate: Date,
          credentialID: String,
          url: String,
        },
      ],
      languages: [
        {
          language: String,
          proficiency: {
            type: String,
            enum: ["Native", "Fluent", "Advanced", "Intermediate", "Basic"],
            default: "Intermediate",
          },
        },
      ],
      customSections: [
        {
          title: String,
          content: String,
        },
      ],
    },
    layout: {
      sectionOrder: [String],
      visibleSections: {
        type: Map,
        of: Boolean,
      },
    },
    style: {
      colors: {
        primary: {
          type: String,
          default: "#3182CE",
        },
        secondary: {
          type: String,
          default: "#4A5568",
        },
        accent: {
          type: String,
          default: "#ED64A6",
        },
      },
      fontSize: {
        type: String,
        enum: ["small", "medium", "large"],
        default: "medium",
      },
      fontFamily: {
        type: String,
        default: "Inter",
      },
      spacing: {
        type: String,
        enum: ["compact", "normal", "spacious"],
        default: "normal",
      },
    },
    atsData: {
      lastScore: Number,
      targetJobTitle: String,
      jobDescription: String,
      keywordMatches: [String],
      missedKeywords: [String],
      suggestions: [String],
      lastAnalysis: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Create text index for searching
ResumeSchema.index({
  title: "text",
  "content.personal.name": "text",
  "content.summary.text": "text",
  "content.experience.company": "text",
  "content.experience.position": "text",
  "content.skills.keywords": "text",
});

export default mongoose.model<IResume>("Resume", ResumeSchema);
