// AI-powered recommendation engine for online mode
interface QuizResponse {
  questionId: string;
  answer: string;
  category: string;
}

interface CareerRecommendation {
  title: string;
  description: string;
  match_percentage: number;
  reason: string;
  required_education: string[];
  skills: string[];
  salary_range: string;
  growth_prospects: string;
}

interface AIQuizAnalysis {
  summary: string;
  strengths: string[];
  work_style: string;
  career_recommendations: CareerRecommendation[];
  course_recommendations?: string[];
}

// In a real implementation, you would use environment variables for API keys
// For now, we'll create a mock AI service that simulates intelligent responses
class AIRecommendationService {
  private apiUrl = 'https://api.openai.com/v1/chat/completions'; // Example API
  
  async generateRecommendations(quizData: QuizResponse[]): Promise<AIQuizAnalysis> {
    console.log('Generating AI-powered recommendations for:', quizData.length, 'responses');
    
    try {
      // For now, we'll use a sophisticated rule-based system that simulates AI responses
      // In production, this would make actual API calls to AI services
      return await this.generateIntelligentRecommendations(quizData);
    } catch (error) {
      console.error('AI recommendation service failed:', error);
      throw new Error('AI service unavailable');
    }
  }
  
  private async generateIntelligentRecommendations(quizData: QuizResponse[]): Promise<AIQuizAnalysis> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Advanced analysis of user responses
    const responseAnalysis = this.analyzeResponsePatterns(quizData);
    const personalityProfile = this.buildPersonalityProfile(quizData);
    const careerAffinities = this.calculateCareerAffinities(quizData, personalityProfile);
    
    // Generate more nuanced career recommendations
    const recommendations = await this.generateAdvancedCareerRecommendations(
      responseAnalysis, 
      personalityProfile, 
      careerAffinities
    );
    
    // Create personalized summary
    const summary = this.generatePersonalizedSummary(personalityProfile, recommendations);
    
    // Extract key strengths with AI-like analysis
    const strengths = this.extractAdvancedStrengths(quizData, personalityProfile);
    
    // Determine sophisticated work style
    const workStyle = this.determineAdvancedWorkStyle(quizData, personalityProfile);
    
    // Generate course recommendations based on career paths
    const courseRecommendations = this.generateIntelligentCourseRecommendations(recommendations);
    
    return {
      summary,
      strengths,
      work_style: workStyle,
      career_recommendations: recommendations,
      course_recommendations: courseRecommendations
    };
  }
  
  private analyzeResponsePatterns(quizData: QuizResponse[]): { [key: string]: number } {
    const patterns: { [key: string]: number } = {
      analytical_thinking: 0,
      creative_expression: 0,
      people_interaction: 0,
      technical_aptitude: 0,
      leadership_tendency: 0,
      research_orientation: 0,
      practical_application: 0,
      innovation_drive: 0
    };
    
    quizData.forEach(response => {
      const answer = response.answer.toLowerCase();
      const category = response.category.toLowerCase();
      
      // Advanced pattern recognition
      if (answer.includes('analysis') || answer.includes('data') || answer.includes('systematic')) {
        patterns.analytical_thinking += 2;
      }
      if (answer.includes('creative') || answer.includes('design') || answer.includes('innovative')) {
        patterns.creative_expression += 2;
      }
      if (answer.includes('team') || answer.includes('people') || answer.includes('communication')) {
        patterns.people_interaction += 2;
      }
      if (answer.includes('technology') || answer.includes('programming') || answer.includes('technical')) {
        patterns.technical_aptitude += 2;
      }
      if (answer.includes('lead') || answer.includes('manage') || answer.includes('decision')) {
        patterns.leadership_tendency += 2;
      }
      if (answer.includes('research') || answer.includes('discover') || answer.includes('experiment')) {
        patterns.research_orientation += 2;
      }
      if (answer.includes('practical') || answer.includes('hands-on') || answer.includes('application')) {
        patterns.practical_application += 2;
      }
      if (answer.includes('new') || answer.includes('innovation') || answer.includes('breakthrough')) {
        patterns.innovation_drive += 2;
      }
    });
    
    return patterns;
  }
  
  private buildPersonalityProfile(quizData: QuizResponse[]): { [key: string]: string } {
    const responses = quizData.map(r => r.answer.toLowerCase()).join(' ');
    
    const profile: { [key: string]: string } = {};
    
    // Determine personality traits based on response patterns
    if (responses.includes('independent') || responses.includes('alone')) {
      profile.social_style = 'Independent and self-reliant';
    } else if (responses.includes('team') || responses.includes('group')) {
      profile.social_style = 'Collaborative and team-oriented';
    } else {
      profile.social_style = 'Adaptable to different social settings';
    }
    
    if (responses.includes('creative') || responses.includes('artistic')) {
      profile.thinking_style = 'Creative and innovative';
    } else if (responses.includes('logical') || responses.includes('systematic')) {
      profile.thinking_style = 'Logical and systematic';
    } else {
      profile.thinking_style = 'Balanced analytical and creative thinking';
    }
    
    if (responses.includes('risk') || responses.includes('entrepreneurship')) {
      profile.risk_tolerance = 'High risk tolerance, entrepreneurial mindset';
    } else if (responses.includes('stable') || responses.includes('security')) {
      profile.risk_tolerance = 'Prefers stability and security';
    } else {
      profile.risk_tolerance = 'Moderate risk tolerance with calculated decisions';
    }
    
    return profile;
  }
  
  private calculateCareerAffinities(quizData: QuizResponse[], profile: { [key: string]: string }): { [key: string]: number } {
    const affinities: { [key: string]: number } = {
      technology: 0,
      healthcare: 0,
      business: 0,
      education: 0,
      creative_arts: 0,
      science_research: 0,
      engineering: 0,
      social_services: 0,
      finance: 0,
      consulting: 0
    };
    
    quizData.forEach(response => {
      const answer = response.answer.toLowerCase();
      
      // Calculate affinities based on responses with more nuance
      if (answer.includes('technology') || answer.includes('software') || answer.includes('digital')) {
        affinities.technology += 3;
      }
      if (answer.includes('health') || answer.includes('medical') || answer.includes('helping others')) {
        affinities.healthcare += 3;
      }
      if (answer.includes('business') || answer.includes('economics') || answer.includes('management')) {
        affinities.business += 3;
      }
      if (answer.includes('teaching') || answer.includes('education') || answer.includes('mentoring')) {
        affinities.education += 3;
      }
      if (answer.includes('creative') || answer.includes('art') || answer.includes('design')) {
        affinities.creative_arts += 3;
      }
      if (answer.includes('research') || answer.includes('science') || answer.includes('discovery')) {
        affinities.science_research += 3;
      }
      if (answer.includes('engineering') || answer.includes('building') || answer.includes('technical')) {
        affinities.engineering += 3;
      }
      if (answer.includes('social') || answer.includes('community') || answer.includes('welfare')) {
        affinities.social_services += 3;
      }
      if (answer.includes('finance') || answer.includes('investment') || answer.includes('economic')) {
        affinities.finance += 3;
      }
      if (answer.includes('consulting') || answer.includes('advisory') || answer.includes('strategy')) {
        affinities.consulting += 3;
      }
    });
    
    return affinities;
  }
  
  private async generateAdvancedCareerRecommendations(
    patterns: { [key: string]: number },
    profile: { [key: string]: string },
    affinities: { [key: string]: number }
  ): Promise<CareerRecommendation[]> {
    
    // Advanced career database with more detailed matching
    const advancedCareers = [
      // Technology Careers
      {
        title: 'AI/Machine Learning Engineer',
        description: 'Design and implement artificial intelligence systems and machine learning algorithms to solve complex problems across various industries.',
        required_education: ['B.Tech Computer Science/AI', 'M.Tech AI/ML', 'Specialized AI Certifications', 'Advanced Mathematics'],
        skills: ['Machine Learning', 'Deep Learning', 'Python/R', 'Neural Networks', 'Statistics', 'Algorithm Design'],
        salary_range: '₹12-40 LPA',
        growth_prospects: 'Exceptional growth potential in the AI revolution with opportunities in cutting-edge research and industry applications',
        match_factors: ['technology', 'analytical_thinking', 'research_orientation', 'innovation_drive'],
        base_score: 85
      },
      {
        title: 'Full-Stack Developer',
        description: 'Create end-to-end web applications, working on both front-end user interfaces and back-end server logic.',
        required_education: ['B.Tech Computer Science', 'Coding Bootcamp', 'Self-taught with Portfolio', 'Web Development Certifications'],
        skills: ['JavaScript', 'React/Angular', 'Node.js', 'Database Management', 'API Development', 'UI/UX Understanding'],
        salary_range: '₹6-25 LPA',
        growth_prospects: 'High demand with opportunities for remote work and entrepreneurship in the digital economy',
        match_factors: ['technology', 'creative_expression', 'practical_application', 'innovation_drive'],
        base_score: 80
      },
      {
        title: 'Cybersecurity Specialist',
        description: 'Protect organizations from digital threats by implementing security measures, conducting risk assessments, and responding to cyber incidents.',
        required_education: ['B.Tech CS/IT', 'Cybersecurity Certifications (CISSP, CEH)', 'Network Security Training'],
        skills: ['Network Security', 'Ethical Hacking', 'Risk Assessment', 'Incident Response', 'Security Protocols'],
        salary_range: '₹8-30 LPA',
        growth_prospects: 'Critical field with excellent job security and high demand across all industries',
        match_factors: ['technology', 'analytical_thinking', 'practical_application'],
        base_score: 78
      },
      // Healthcare Careers
      {
        title: 'Biomedical Engineer',
        description: 'Combine engineering principles with biological sciences to design medical devices, artificial organs, and health monitoring systems.',
        required_education: ['B.Tech Biomedical', 'M.Tech Biomedical', 'Medical Device Certifications'],
        skills: ['Engineering Design', 'Biology Knowledge', 'Medical Device Development', 'Regulatory Compliance'],
        salary_range: '₹6-20 LPA',
        growth_prospects: 'Growing field at the intersection of technology and healthcare with innovative opportunities',
        match_factors: ['technology', 'research_orientation', 'innovation_drive', 'people_interaction'],
        base_score: 75
      },
      {
        title: 'Clinical Data Scientist',
        description: 'Analyze medical data to improve patient outcomes, support clinical trials, and advance evidence-based medicine.',
        required_education: ['Medical/Life Sciences Background', 'Statistics/Data Science Masters', 'Clinical Research Experience'],
        skills: ['Statistical Analysis', 'Medical Knowledge', 'Data Visualization', 'Clinical Trial Design'],
        salary_range: '₹8-22 LPA',
        growth_prospects: 'Rapidly growing field combining healthcare and data science with significant impact potential',
        match_factors: ['analytical_thinking', 'research_orientation', 'people_interaction'],
        base_score: 82
      },
      // Business and Finance
      {
        title: 'Product Manager',
        description: 'Drive product strategy and development by understanding user needs, market trends, and business objectives.',
        required_education: ['MBA', 'B.Tech with Business Experience', 'Product Management Certifications'],
        skills: ['Strategic Thinking', 'Market Research', 'User Experience', 'Cross-functional Leadership', 'Data Analysis'],
        salary_range: '₹10-35 LPA',
        growth_prospects: 'High-growth role with opportunities to lead innovation and drive business success',
        match_factors: ['leadership_tendency', 'analytical_thinking', 'people_interaction', 'innovation_drive'],
        base_score: 85
      },
      {
        title: 'Sustainability Consultant',
        description: 'Help organizations develop and implement sustainable practices, reduce environmental impact, and meet ESG goals.',
        required_education: ['Environmental Science/Engineering', 'Business/Sustainability MBA', 'Green Certifications'],
        skills: ['Environmental Assessment', 'Strategic Planning', 'Stakeholder Engagement', 'Regulatory Knowledge'],
        salary_range: '₹6-18 LPA',
        growth_prospects: 'Rapidly expanding field with increasing corporate focus on sustainability and environmental responsibility',
        match_factors: ['analytical_thinking', 'research_orientation', 'people_interaction'],
        base_score: 72
      },
      // Creative and Design
      {
        title: 'UX/UI Designer',
        description: 'Create intuitive and engaging user experiences for digital products through research, design, and testing.',
        required_education: ['Design Degree', 'UX Bootcamp', 'Portfolio Development', 'Design Thinking Certification'],
        skills: ['User Research', 'Prototyping', 'Visual Design', 'Usability Testing', 'Design Tools (Figma, Adobe)'],
        salary_range: '₹5-20 LPA',
        growth_prospects: 'High demand in digital transformation with opportunities in emerging technologies like VR/AR',
        match_factors: ['creative_expression', 'people_interaction', 'analytical_thinking'],
        base_score: 76
      },
      // Science and Research
      {
        title: 'Renewable Energy Engineer',
        description: 'Design and develop sustainable energy systems including solar, wind, and other renewable technologies.',
        required_education: ['B.Tech Electrical/Mechanical', 'M.Tech Renewable Energy', 'Sustainable Energy Certifications'],
        skills: ['Energy Systems Design', 'Project Management', 'Environmental Analysis', 'Technical Innovation'],
        salary_range: '₹6-18 LPA',
        growth_prospects: 'Critical field for future with strong government support and growing industry investment',
        match_factors: ['technical_aptitude', 'innovation_drive', 'practical_application'],
        base_score: 74
      },
      // Education and Training
      {
        title: 'Corporate Learning & Development Specialist',
        description: 'Design and deliver training programs that enhance employee skills and drive organizational performance.',
        required_education: ['Psychology/Education Degree', 'L&D Certifications', 'Corporate Training Experience'],
        skills: ['Training Design', 'Adult Learning Theory', 'Performance Analysis', 'Technology Integration'],
        salary_range: '₹5-15 LPA',
        growth_prospects: 'Growing field with focus on upskilling and continuous learning in the modern workplace',
        match_factors: ['people_interaction', 'creative_expression', 'analytical_thinking'],
        base_score: 70
      }
    ];
    
    // Calculate match scores for each career
    const scoredCareers = advancedCareers.map(career => {
      let score = career.base_score;
      
      // Add points based on pattern matches
      career.match_factors.forEach(factor => {
        if (patterns[factor]) {
          score += patterns[factor] * 2;
        }
      });
      
      // Add points based on affinity matches
      Object.keys(affinities).forEach(affinity => {
        if (career.description.toLowerCase().includes(affinity.replace('_', ' '))) {
          score += affinities[affinity];
        }
      });
      
      // Normalize score to percentage (max 100%)
      const matchPercentage = Math.min(Math.round(score), 100);
      
      // Generate AI-like reasoning
      const reasoning = this.generateAdvancedReasoning(career, patterns, profile);
      
      return {
        title: career.title,
        description: career.description,
        match_percentage: matchPercentage,
        reason: reasoning,
        required_education: career.required_education,
        skills: career.skills,
        salary_range: career.salary_range,
        growth_prospects: career.growth_prospects
      };
    });
    
    // Return top 4 recommendations, sorted by score
    return scoredCareers
      .sort((a, b) => b.match_percentage - a.match_percentage)
      .slice(0, 4);
  }
  
  private generateAdvancedReasoning(career: any, patterns: { [key: string]: number }, profile: { [key: string]: string }): string {
    const reasons = [];
    
    // Analyze strongest patterns
    const topPatterns = Object.entries(patterns)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2)
      .map(([pattern]) => pattern);
    
    if (topPatterns.includes('analytical_thinking')) {
      reasons.push('your strong analytical and problem-solving capabilities');
    }
    if (topPatterns.includes('creative_expression')) {
      reasons.push('your creative thinking and innovative approach');
    }
    if (topPatterns.includes('technical_aptitude')) {
      reasons.push('your technical skills and aptitude for complex systems');
    }
    if (topPatterns.includes('leadership_tendency')) {
      reasons.push('your natural leadership qualities and decision-making skills');
    }
    
    // Add personality-based reasoning
    if (profile.thinking_style?.includes('innovative')) {
      reasons.push('your innovative mindset and forward-thinking approach');
    }
    
    const reasonText = reasons.length > 0 
      ? `This role aligns well with ${reasons.slice(0, 2).join(' and ')}.`
      : 'This career matches your unique combination of skills and interests.';
    
    return `${reasonText} Your profile suggests you would thrive in this dynamic and evolving field.`;
  }
  
  private extractAdvancedStrengths(quizData: QuizResponse[], profile: { [key: string]: string }): string[] {
    const strengths = new Set<string>();
    
    const responses = quizData.map(r => r.answer.toLowerCase()).join(' ');
    
    // Advanced strength detection
    if (responses.includes('analysis') || responses.includes('data') || responses.includes('systematic')) {
      strengths.add('Advanced Analytical Thinking');
    }
    if (responses.includes('creative') || responses.includes('innovative') || responses.includes('design')) {
      strengths.add('Creative Problem Solving');
    }
    if (responses.includes('team') || responses.includes('communication') || responses.includes('people')) {
      strengths.add('Strong Interpersonal Skills');
    }
    if (responses.includes('leadership') || responses.includes('manage') || responses.includes('decision')) {
      strengths.add('Natural Leadership Abilities');
    }
    if (responses.includes('technology') || responses.includes('technical') || responses.includes('programming')) {
      strengths.add('Technical Proficiency');
    }
    if (responses.includes('research') || responses.includes('learning') || responses.includes('discovery')) {
      strengths.add('Continuous Learning Mindset');
    }
    if (responses.includes('adapt') || responses.includes('flexible') || responses.includes('change')) {
      strengths.add('Adaptability and Resilience');
    }
    
    // Ensure at least 3 strengths
    if (strengths.size < 3) {
      strengths.add('Strategic Thinking');
      strengths.add('Attention to Detail');
      strengths.add('Goal-Oriented Approach');
    }
    
    return Array.from(strengths).slice(0, 5);
  }
  
  private determineAdvancedWorkStyle(quizData: QuizResponse[], profile: { [key: string]: string }): string {
    const responses = quizData.map(r => r.answer.toLowerCase()).join(' ');
    
    let style = '';
    
    // Determine primary work style
    if (responses.includes('independent') || responses.includes('autonomous')) {
      style = 'Independent and self-directed';
    } else if (responses.includes('team') || responses.includes('collaborative')) {
      style = 'Collaborative and team-oriented';
    } else {
      style = 'Adaptable to various work environments';
    }
    
    // Add secondary characteristics
    if (responses.includes('innovative') || responses.includes('creative')) {
      style += ', with a focus on innovation and creative solutions';
    } else if (responses.includes('systematic') || responses.includes('methodical')) {
      style += ', with a systematic and methodical approach';
    } else {
      style += ', balancing structure with flexibility';
    }
    
    return style;
  }
  
  private generatePersonalizedSummary(profile: { [key: string]: string }, recommendations: CareerRecommendation[]): string {
    const topCareer = recommendations[0];
    const secondCareer = recommendations[1];
    
    let summary = `Based on your comprehensive career assessment, you demonstrate exceptional potential in ${topCareer.title.toLowerCase()} with a ${topCareer.match_percentage}% compatibility match. `;
    
    summary += `Your unique combination of ${profile.thinking_style?.toLowerCase() || 'balanced thinking'} and ${profile.social_style?.toLowerCase() || 'adaptable work style'} `;
    summary += `makes you particularly well-suited for roles that require both technical expertise and strategic thinking. `;
    
    if (secondCareer && secondCareer.match_percentage > 75) {
      summary += `You also show strong alignment with ${secondCareer.title.toLowerCase()} (${secondCareer.match_percentage}% match), `;
      summary += `suggesting versatility in career options and potential for interdisciplinary success.`;
    } else {
      summary += `Your profile indicates a clear career direction with strong foundational skills for long-term success.`;
    }
    
    return summary;
  }
  
  private generateIntelligentCourseRecommendations(recommendations: CareerRecommendation[]): string[] {
    const courses = new Set<string>();
    
    recommendations.forEach(career => {
      // Extract relevant courses from education requirements
      career.required_education.forEach(edu => {
        if (edu.includes('B.Tech')) {
          courses.add('Bachelor of Technology (B.Tech)');
        }
        if (edu.includes('MBA')) {
          courses.add('Master of Business Administration (MBA)');
        }
        if (edu.includes('M.Tech')) {
          courses.add('Master of Technology (M.Tech)');
        }
        if (edu.includes('Data Science')) {
          courses.add('Data Science Specialization');
        }
        if (edu.includes('AI') || edu.includes('Machine Learning')) {
          courses.add('Artificial Intelligence & Machine Learning');
        }
        if (edu.includes('Certification')) {
          courses.add('Professional Certifications');
        }
      });
    });
    
    // Add some intelligent additional recommendations
    courses.add('Digital Literacy & Technology Skills');
    courses.add('Communication & Leadership Development');
    
    return Array.from(courses).slice(0, 6);
  }
}

// Export the service instance
export const aiRecommendationService = new AIRecommendationService();

// Main function to generate AI recommendations
export async function generateAIRecommendations(quizData: QuizResponse[]): Promise<AIQuizAnalysis> {
  return await aiRecommendationService.generateRecommendations(quizData);
}