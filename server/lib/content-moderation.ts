// Content moderation utilities for preventing illegal/inappropriate content

interface ModerationResult {
  isAllowed: boolean;
  confidence: number;
  reasons: string[];
  category?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

// Comprehensive list of prohibited content patterns
const PROHIBITED_PATTERNS = {
  // Illegal content
  illegal: [
    /child\s*(porn|abuse|exploitation)/gi,
    /illegal\s*(drugs|weapons|firearms)/gi,
    /human\s*trafficking/gi,
    /money\s*laundering/gi,
    /terrorist/gi,
    /bomb\s*(making|instructions)/gi,
    /assassination/gi,
    /murder\s*(instructions|how\s*to)/gi,
  ],
  
  // Hate speech and harassment
  hate: [
    /kill\s*(yourself|urself)/gi,
    /nazi|hitler/gi,
    /racial\s*slur/gi,
    /hate\s*(speech|crime)/gi,
    /genocide/gi,
    /lynch/gi,
  ],
  
  // Adult content
  adult: [
    /explicit\s*(sex|sexual)/gi,
    /pornographic/gi,
    /nude\s*(photos|images)/gi,
    /sexual\s*(content|material)/gi,
    /adult\s*(content|material)/gi,
  ],
  
  // Spam and scam
  spam: [
    /get\s*rich\s*quick/gi,
    /make\s*money\s*fast/gi,
    /click\s*here\s*now/gi,
    /limited\s*time\s*offer/gi,
    /act\s*now/gi,
    /free\s*money/gi,
    /guaranteed\s*income/gi,
  ],
  
  // Violence
  violence: [
    /graphic\s*violence/gi,
    /torture\s*(methods|techniques)/gi,
    /self\s*harm/gi,
    /suicide\s*(instructions|methods)/gi,
    /violent\s*(content|imagery)/gi,
  ],
  
  // Privacy violations
  privacy: [
    /personal\s*(information|data)/gi,
    /social\s*security\s*number/gi,
    /credit\s*card\s*number/gi,
    /private\s*(address|phone)/gi,
    /doxxing/gi,
  ],
  
  // Copyright infringement
  copyright: [
    /pirated\s*(content|software)/gi,
    /copyright\s*infringement/gi,
    /stolen\s*(content|material)/gi,
    /unauthorized\s*(copy|distribution)/gi,
  ]
};

// Suspicious keywords that require manual review
const SUSPICIOUS_KEYWORDS = [
  'hack', 'crack', 'bypass', 'exploit', 'vulnerability',
  'phishing', 'malware', 'virus', 'trojan',
  'darkweb', 'tor', 'anonymous', 'untraceable',
  'fake', 'counterfeit', 'forged', 'fraudulent',
  'blackmail', 'extortion', 'ransom',
  'insider trading', 'market manipulation',
  'tax evasion', 'offshore account'
];

// Safe content indicators
const SAFE_INDICATORS = [
  'educational', 'tutorial', 'learning', 'creative',
  'business', 'marketing', 'productivity', 'writing',
  'coding', 'programming', 'development', 'design',
  'research', 'analysis', 'professional', 'academic'
];

export class ContentModerator {
  
  /**
   * Main moderation function
   */
  static moderateContent(content: string, title?: string, description?: string): ModerationResult {
    const fullText = [content, title, description].filter(Boolean).join(' ').toLowerCase();
    
    // Check for prohibited content
    const prohibitedCheck = this.checkProhibitedContent(fullText);
    if (!prohibitedCheck.isAllowed) {
      return prohibitedCheck;
    }
    
    // Check for suspicious content
    const suspiciousCheck = this.checkSuspiciousContent(fullText);
    if (!suspiciousCheck.isAllowed) {
      return suspiciousCheck;
    }
    
    // Check content quality
    const qualityCheck = this.checkContentQuality(content);
    
    // Calculate overall confidence
    const confidence = this.calculateConfidence(fullText);
    
    return {
      isAllowed: true,
      confidence,
      reasons: ['Content passed all moderation checks'],
      category: 'safe',
      severity: 'low'
    };
  }
  
  /**
   * Check for explicitly prohibited content
   */
  private static checkProhibitedContent(text: string): ModerationResult {
    for (const [category, patterns] of Object.entries(PROHIBITED_PATTERNS)) {
      for (const pattern of patterns) {
        if (pattern.test(text)) {
          return {
            isAllowed: false,
            confidence: 0.95,
            reasons: [`Contains prohibited ${category} content`],
            category,
            severity: 'critical'
          };
        }
      }
    }
    
    return { isAllowed: true, confidence: 1.0, reasons: [] };
  }
  
  /**
   * Check for suspicious content that needs manual review
   */
  private static checkSuspiciousContent(text: string): ModerationResult {
    const suspiciousMatches = SUSPICIOUS_KEYWORDS.filter(keyword => 
      text.includes(keyword.toLowerCase())
    );
    
    if (suspiciousMatches.length > 2) {
      return {
        isAllowed: false,
        confidence: 0.7,
        reasons: [`Contains multiple suspicious keywords: ${suspiciousMatches.join(', ')}`],
        category: 'suspicious',
        severity: 'high'
      };
    }
    
    if (suspiciousMatches.length > 0) {
      return {
        isAllowed: false,
        confidence: 0.5,
        reasons: [`Contains suspicious keywords: ${suspiciousMatches.join(', ')}`],
        category: 'suspicious',
        severity: 'medium'
      };
    }
    
    return { isAllowed: true, confidence: 1.0, reasons: [] };
  }
  
  /**
   * Check content quality and spam indicators
   */
  private static checkContentQuality(content: string): ModerationResult {
    // Check for excessive capitalization
    const capsRatio = (content.match(/[A-Z]/g) || []).length / content.length;
    if (capsRatio > 0.5 && content.length > 20) {
      return {
        isAllowed: false,
        confidence: 0.8,
        reasons: ['Excessive use of capital letters (potential spam)'],
        category: 'spam',
        severity: 'medium'
      };
    }
    
    // Check for excessive repetition
    const words = content.toLowerCase().split(/\s+/);
    const wordCounts = words.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const maxRepetition = Math.max(...Object.values(wordCounts));
    if (maxRepetition > words.length * 0.3 && words.length > 10) {
      return {
        isAllowed: false,
        confidence: 0.7,
        reasons: ['Excessive word repetition (potential spam)'],
        category: 'spam',
        severity: 'medium'
      };
    }
    
    // Check minimum content length
    if (content.trim().length < 10) {
      return {
        isAllowed: false,
        confidence: 0.6,
        reasons: ['Content too short to be meaningful'],
        category: 'quality',
        severity: 'low'
      };
    }
    
    return { isAllowed: true, confidence: 1.0, reasons: [] };
  }
  
  /**
   * Calculate confidence score based on safe indicators
   */
  private static calculateConfidence(text: string): number {
    const safeMatches = SAFE_INDICATORS.filter(indicator => 
      text.includes(indicator.toLowerCase())
    );
    
    // Base confidence
    let confidence = 0.5;
    
    // Increase confidence for safe indicators
    confidence += safeMatches.length * 0.1;
    
    // Cap at 1.0
    return Math.min(confidence, 1.0);
  }
  
  /**
   * Check if user has history of violations
   */
  static async checkUserHistory(userId: string): Promise<{
    isReliable: boolean;
    violationCount: number;
    lastViolation?: Date;
  }> {
    // In a real implementation, this would query the database
    // For now, return mock data
    return {
      isReliable: true,
      violationCount: 0,
      lastViolation: undefined
    };
  }
  
  /**
   * Auto-moderate based on AI/ML (placeholder for future implementation)
   */
  static async aiModerate(content: string): Promise<ModerationResult> {
    // Placeholder for AI moderation service integration
    // Could integrate with services like:
    // - OpenAI Moderation API
    // - Google Cloud Natural Language API
    // - AWS Comprehend
    // - Azure Content Moderator
    
    return {
      isAllowed: true,
      confidence: 0.8,
      reasons: ['AI moderation passed'],
      category: 'ai-approved',
      severity: 'low'
    };
  }
  
  /**
   * Generate moderation report
   */
  static generateReport(result: ModerationResult, content: string): {
    summary: string;
    recommendation: string;
    action: 'approve' | 'reject' | 'review';
  } {
    let action: 'approve' | 'reject' | 'review' = 'approve';
    let recommendation = 'Content is safe to publish';
    
    if (!result.isAllowed) {
      if (result.severity === 'critical') {
        action = 'reject';
        recommendation = 'Content violates community guidelines and should be rejected immediately';
      } else if (result.severity === 'high') {
        action = 'review';
        recommendation = 'Content requires manual review before publication';
      } else {
        action = 'review';
        recommendation = 'Content has minor issues that should be reviewed';
      }
    }
    
    return {
      summary: `Moderation confidence: ${(result.confidence * 100).toFixed(1)}%. ${result.reasons.join('. ')}`,
      recommendation,
      action
    };
  }
}

// Export utility functions
export const moderatePromptContent = (content: string, title?: string, description?: string) => {
  return ContentModerator.moderateContent(content, title, description);
};

export const checkUserReliability = (userId: string) => {
  return ContentModerator.checkUserHistory(userId);
};

export const generateModerationReport = (result: ModerationResult, content: string) => {
  return ContentModerator.generateReport(result, content);
};
