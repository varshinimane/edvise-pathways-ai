// src/lib/offlineRecommendationEngine.ts - Rule-based recommendation system
import { offlineStorage, OfflineRecommendation } from './offlineStorage';

interface QuizResponse {
  questionId: string;
  answer: string;
  category: string;
}

interface OfflineRecommendationResult {
  career_recommendations: Array<{
    title: string;
    description: string;
    match_percentage: number;
    reason: string;
    required_education: string[];
    skills: string[];
    salary_range: string;
    growth_prospects: string;
  }>;
  summary: string;
  strengths: string[];
  work_style: string;
}

class OfflineRecommendationEngine {
  private careerMappings = {
    'science_research': [
      'Research Scientist',
      'Data Scientist',
      'Biotechnologist',
      'Environmental Scientist',
      'Physics Researcher'
    ],
    'engineering_tech': [
      'Software Engineer',
      'Mechanical Engineer',
      'Civil Engineer',
      'Electrical Engineer',
      'Aerospace Engineer'
    ],
    'medical_healthcare': [
      'Doctor',
      'Nurse',
      'Pharmacist',
      'Physiotherapist',
      'Medical Researcher'
    ],
    'business_management': [
      'Business Analyst',
      'Project Manager',
      'Marketing Manager',
      'Financial Analyst',
      'Entrepreneur'
    ],
    'arts_creative': [
      'Graphic Designer',
      'Content Writer',
      'Photographer',
      'Artist',
      'Creative Director'
    ],
    'education_teaching': [
      'Teacher',
      'Professor',
      'Educational Consultant',
      'Curriculum Developer',
      'Training Specialist'
    ],
    'social_services': [
      'Social Worker',
      'Counselor',
      'Community Manager',
      'NGO Coordinator',
      'Policy Analyst'
    ]
  };

  private educationMappings = {
    'science_research': ['B.Sc', 'M.Sc', 'Ph.D', 'Research Programs'],
    'engineering_tech': ['B.Tech', 'M.Tech', 'Diploma in Engineering'],
    'medical_healthcare': ['MBBS', 'BDS', 'B.Pharm', 'Nursing', 'Physiotherapy'],
    'business_management': ['BBA', 'MBA', 'Commerce', 'Economics'],
    'arts_creative': ['BFA', 'MFA', 'Design Courses', 'Media Studies'],
    'education_teaching': ['B.Ed', 'M.Ed', 'Subject-specific degrees'],
    'social_services': ['Social Work', 'Psychology', 'Sociology', 'Public Administration']
  };

  private skillMappings = {
    'science_research': ['Analytical Thinking', 'Research Skills', 'Data Analysis', 'Problem Solving'],
    'engineering_tech': ['Technical Skills', 'Programming', 'Design', 'Innovation'],
    'medical_healthcare': ['Empathy', 'Attention to Detail', 'Communication', 'Critical Thinking'],
    'business_management': ['Leadership', 'Communication', 'Strategic Thinking', 'Financial Acumen'],
    'arts_creative': ['Creativity', 'Design Skills', 'Communication', 'Visual Thinking'],
    'education_teaching': ['Communication', 'Patience', 'Subject Knowledge', 'Mentoring'],
    'social_services': ['Empathy', 'Communication', 'Problem Solving', 'Community Building']
  };

  async generateRecommendations(quizResponses: QuizResponse[]): Promise<OfflineRecommendationResult> {
    // Analyze quiz responses to determine interests
    const interests = this.analyzeInterests(quizResponses);
    
    // Get offline recommendations from IndexedDB
    const offlineRecs = await offlineStorage.getOfflineRecommendations(interests);
    
    // Generate career recommendations based on interests
    const careerRecommendations = this.generateCareerRecommendations(interests, offlineRecs);
    
    // Generate summary and insights
    const summary = this.generateSummary(interests, careerRecommendations);
    const strengths = this.identifyStrengths(interests);
    const workStyle = this.determineWorkStyle(interests);

    return {
      career_recommendations: careerRecommendations,
      summary,
      strengths,
      work_style: workStyle
    };
  }

  private analyzeInterests(quizResponses: QuizResponse[]): string[] {
    const interestScores: { [key: string]: number } = {};
    
    quizResponses.forEach(response => {
      const category = response.category.toLowerCase();
      const answer = response.answer.toLowerCase();
      
      // Map answers to interest categories
      if (answer.includes('science') || answer.includes('research') || answer.includes('experiment')) {
        interestScores['science_research'] = (interestScores['science_research'] || 0) + 1;
      }
      if (answer.includes('technology') || answer.includes('engineering') || answer.includes('computer')) {
        interestScores['engineering_tech'] = (interestScores['engineering_tech'] || 0) + 1;
      }
      if (answer.includes('health') || answer.includes('medical') || answer.includes('help people')) {
        interestScores['medical_healthcare'] = (interestScores['medical_healthcare'] || 0) + 1;
      }
      if (answer.includes('business') || answer.includes('management') || answer.includes('leadership')) {
        interestScores['business_management'] = (interestScores['business_management'] || 0) + 1;
      }
      if (answer.includes('art') || answer.includes('creative') || answer.includes('design')) {
        interestScores['arts_creative'] = (interestScores['arts_creative'] || 0) + 1;
      }
      if (answer.includes('teaching') || answer.includes('education') || answer.includes('learn')) {
        interestScores['education_teaching'] = (interestScores['education_teaching'] || 0) + 1;
      }
      if (answer.includes('social') || answer.includes('community') || answer.includes('help')) {
        interestScores['social_services'] = (interestScores['social_services'] || 0) + 1;
      }
    });

    // Return top 3 interest categories
    return Object.entries(interestScores)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category);
  }

  private generateCareerRecommendations(interests: string[], offlineRecs: OfflineRecommendation[]): any[] {
    const recommendations: any[] = [];
    
    interests.forEach((interest, index) => {
      const careers = this.careerMappings[interest as keyof typeof this.careerMappings] || [];
      const education = this.educationMappings[interest as keyof typeof this.educationMappings] || [];
      const skills = this.skillMappings[interest as keyof typeof this.skillMappings] || [];
      
      careers.slice(0, 2).forEach(career => {
        const matchPercentage = Math.max(85 - (index * 10), 60);
        
        recommendations.push({
          title: career,
          description: this.getCareerDescription(career, interest),
          match_percentage: matchPercentage,
          reason: this.getMatchReason(interest, career),
          required_education: education,
          skills: skills,
          salary_range: this.getSalaryRange(career),
          growth_prospects: this.getGrowthProspects(career)
        });
      });
    });

    // Add offline recommendations if available
    offlineRecs.slice(0, 2).forEach(rec => {
      recommendations.push({
        title: rec.career_title,
        description: rec.description,
        match_percentage: 75,
        reason: `Based on your interests in ${rec.keywords.join(', ')}`,
        required_education: rec.required_education,
        skills: rec.skills,
        salary_range: rec.salary_range,
        growth_prospects: rec.growth_prospects
      });
    });

    return recommendations.slice(0, 5); // Return top 5 recommendations
  }

  private getCareerDescription(career: string, interest: string): string {
    const descriptions: { [key: string]: string } = {
      'Research Scientist': 'Conduct research in various scientific fields, analyze data, and contribute to scientific knowledge.',
      'Software Engineer': 'Design, develop, and maintain software applications and systems.',
      'Doctor': 'Diagnose and treat patients, provide medical care and health advice.',
      'Business Analyst': 'Analyze business processes and recommend improvements for efficiency.',
      'Graphic Designer': 'Create visual concepts and designs for various media and communications.',
      'Teacher': 'Educate and mentor students in various subjects and life skills.',
      'Social Worker': 'Help individuals and communities overcome challenges and improve their lives.'
    };
    
    return descriptions[career] || `A career in ${career} that aligns with your interests in ${interest.replace('_', ' ')}.`;
  }

  private getMatchReason(interest: string, career: string): string {
    const reasons: { [key: string]: string } = {
      'science_research': 'Your analytical thinking and interest in research make you well-suited for scientific careers.',
      'engineering_tech': 'Your technical aptitude and problem-solving skills align with engineering roles.',
      'medical_healthcare': 'Your desire to help others and interest in health sciences make you ideal for healthcare.',
      'business_management': 'Your leadership potential and strategic thinking suit business and management roles.',
      'arts_creative': 'Your creative abilities and artistic interests make you perfect for creative careers.',
      'education_teaching': 'Your passion for learning and helping others makes you ideal for education.',
      'social_services': 'Your empathy and desire to help communities suit social service careers.'
    };
    
    return reasons[interest] || `Your interests align well with ${career} based on your quiz responses.`;
  }

  private getSalaryRange(career: string): string {
    const salaryRanges: { [key: string]: string } = {
      'Research Scientist': '₹6-15 LPA',
      'Software Engineer': '₹4-20 LPA',
      'Doctor': '₹8-25 LPA',
      'Business Analyst': '₹5-18 LPA',
      'Graphic Designer': '₹3-12 LPA',
      'Teacher': '₹3-10 LPA',
      'Social Worker': '₹3-8 LPA'
    };
    
    return salaryRanges[career] || '₹4-12 LPA';
  }

  private getGrowthProspects(career: string): string {
    const prospects: { [key: string]: string } = {
      'Research Scientist': 'High growth potential in R&D sectors',
      'Software Engineer': 'Excellent growth in tech industry',
      'Doctor': 'Stable and growing healthcare sector',
      'Business Analyst': 'Growing demand in corporate sector',
      'Graphic Designer': 'Good opportunities in digital media',
      'Teacher': 'Stable career with good job security',
      'Social Worker': 'Growing need in social services'
    };
    
    return prospects[career] || 'Good growth potential in the field';
  }

  private generateSummary(interests: string[], recommendations: any[]): string {
    const topInterest = interests[0]?.replace('_', ' ') || 'various fields';
    const topCareer = recommendations[0]?.title || 'career path';
    
    return `Based on your quiz responses, you show strong interest in ${topInterest}. Your top recommendation is ${topCareer}, which aligns well with your interests and skills. You have ${recommendations.length} career options that match your profile.`;
  }

  private identifyStrengths(interests: string[]): string[] {
    const strengthMap: { [key: string]: string[] } = {
      'science_research': ['Analytical Thinking', 'Research Skills', 'Problem Solving'],
      'engineering_tech': ['Technical Skills', 'Innovation', 'Logical Thinking'],
      'medical_healthcare': ['Empathy', 'Attention to Detail', 'Communication'],
      'business_management': ['Leadership', 'Strategic Thinking', 'Communication'],
      'arts_creative': ['Creativity', 'Visual Thinking', 'Communication'],
      'education_teaching': ['Communication', 'Patience', 'Subject Knowledge'],
      'social_services': ['Empathy', 'Community Building', 'Problem Solving']
    };
    
    const strengths: string[] = [];
    interests.forEach(interest => {
      const interestStrengths = strengthMap[interest] || [];
      strengths.push(...interestStrengths);
    });
    
    return [...new Set(strengths)]; // Remove duplicates
  }

  private determineWorkStyle(interests: string[]): string {
    if (interests.includes('science_research') || interests.includes('engineering_tech')) {
      return 'You prefer analytical and methodical work environments with opportunities for research and innovation.';
    }
    if (interests.includes('medical_healthcare') || interests.includes('social_services')) {
      return 'You thrive in people-oriented environments where you can help and serve others.';
    }
    if (interests.includes('business_management')) {
      return 'You work best in dynamic, leadership-oriented environments with opportunities for growth.';
    }
    if (interests.includes('arts_creative')) {
      return 'You prefer creative, flexible work environments that allow for artistic expression.';
    }
    if (interests.includes('education_teaching')) {
      return 'You excel in educational environments where you can share knowledge and mentor others.';
    }
    
    return 'You adapt well to various work environments based on your diverse interests.';
  }
}

export const offlineRecommendationEngine = new OfflineRecommendationEngine();
