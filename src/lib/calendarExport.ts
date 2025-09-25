// Calendar Export Utilities for Timeline Tracker
import { TimelineEvent } from './timelineData';

export interface CalendarEventData {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  url?: string;
  categories: string[];
  priority: 'high' | 'medium' | 'low';
}

class CalendarExportService {
  
  /**
   * Convert TimelineEvent to CalendarEventData
   */
  private convertToCalendarEvent(event: TimelineEvent): CalendarEventData {
    return {
      title: event.title,
      description: event.description,
      startDate: new Date(event.dates.start),
      endDate: new Date(event.dates.end),
      location: 'Online',
      url: event.website,
      categories: [event.category, event.type],
      priority: event.priority
    };
  }

  /**
   * Generate ICS (iCalendar) format
   */
  generateICS(events: TimelineEvent[], filename: string = 'timeline-events.ics'): void {
    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//EdVise//Timeline Tracker//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:EdVise Timeline Tracker',
      'X-WR-CALDESC:Important educational events and deadlines',
      'X-WR-TIMEZONE:Asia/Kolkata'
    ];

    events.forEach(event => {
      const calEvent = this.convertToCalendarEvent(event);
      const uid = `${event.id}@edvise.com`;
      const dtstamp = this.formatDateTimeICS(new Date());
      const dtstart = this.formatDateICS(calEvent.startDate);
      const dtend = this.formatDateICS(calEvent.endDate);
      
      icsContent.push(
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${dtstamp}`,
        `DTSTART;VALUE=DATE:${dtstart}`,
        `DTEND;VALUE=DATE:${dtend}`,
        `SUMMARY:${this.escapeICSText(calEvent.title)}`,
        `DESCRIPTION:${this.escapeICSText(calEvent.description)}`,
        `URL:${calEvent.url}`,
        `CATEGORIES:${calEvent.categories.join(',')}`,
        `PRIORITY:${this.getPriorityNumber(calEvent.priority)}`,
        `STATUS:CONFIRMED`,
        `TRANSP:TRANSPARENT`,
        'END:VEVENT'
      );

      // Add exam date if available
      if (event.dates.exam_date) {
        const examUid = `${event.id}-exam@edvise.com`;
        const examDate = new Date(event.dates.exam_date);
        
        icsContent.push(
          'BEGIN:VEVENT',
          `UID:${examUid}`,
          `DTSTAMP:${dtstamp}`,
          `DTSTART;VALUE=DATE:${this.formatDateICS(examDate)}`,
          `DTEND;VALUE=DATE:${this.formatDateICS(examDate)}`,
          `SUMMARY:${this.escapeICSText(`Exam: ${calEvent.title}`)}`,
          `DESCRIPTION:${this.escapeICSText(`Exam date for ${calEvent.description}`)}`,
          `URL:${calEvent.url}`,
          `CATEGORIES:exam,${event.category}`,
          `PRIORITY:${this.getPriorityNumber('high')}`,
          `STATUS:CONFIRMED`,
          `TRANSP:OPAQUE`,
          'END:VEVENT'
        );
      }

      // Add result date if available
      if (event.dates.result_date) {
        const resultUid = `${event.id}-result@edvise.com`;
        const resultDate = new Date(event.dates.result_date);
        
        icsContent.push(
          'BEGIN:VEVENT',
          `UID:${resultUid}`,
          `DTSTAMP:${dtstamp}`,
          `DTSTART;VALUE=DATE:${this.formatDateICS(resultDate)}`,
          `DTEND;VALUE=DATE:${this.formatDateICS(resultDate)}`,
          `SUMMARY:${this.escapeICSText(`Results: ${calEvent.title}`)}`,
          `DESCRIPTION:${this.escapeICSText(`Results expected for ${calEvent.description}`)}`,
          `URL:${calEvent.url}`,
          `CATEGORIES:result,${event.category}`,
          `PRIORITY:${this.getPriorityNumber('medium')}`,
          `STATUS:CONFIRMED`,
          `TRANSP:TRANSPARENT`,
          'END:VEVENT'
        );
      }
    });

    icsContent.push('END:VCALENDAR');

    const blob = new Blob([icsContent.join('\r\n')], { 
      type: 'text/calendar;charset=utf-8' 
    });
    
    this.downloadFile(blob, filename);
  }

  /**
   * Generate Google Calendar URL
   */
  generateGoogleCalendarUrl(event: TimelineEvent): string {
    const calEvent = this.convertToCalendarEvent(event);
    const baseUrl = 'https://calendar.google.com/calendar/render';
    
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: calEvent.title,
      details: `${calEvent.description}\n\nWebsite: ${calEvent.url}`,
      dates: `${this.formatGoogleDate(calEvent.startDate)}/${this.formatGoogleDate(calEvent.endDate)}`,
      location: calEvent.location || '',
      sprop: 'website:edvise.com',
      sprop_name: 'EdVise Timeline Tracker'
    });

    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * Generate Outlook Calendar URL
   */
  generateOutlookCalendarUrl(event: TimelineEvent): string {
    const calEvent = this.convertToCalendarEvent(event);
    const baseUrl = 'https://outlook.live.com/calendar/0/deeplink/compose';
    
    const params = new URLSearchParams({
      path: '/calendar/action/compose',
      rru: 'addevent',
      subject: calEvent.title,
      body: `${calEvent.description}\n\nWebsite: ${calEvent.url}`,
      startdt: calEvent.startDate.toISOString(),
      enddt: calEvent.endDate.toISOString(),
      location: calEvent.location || ''
    });

    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * Export events as CSV for spreadsheet applications
   */
  generateCSV(events: TimelineEvent[], filename: string = 'timeline-events.csv'): void {
    const headers = [
      'Title',
      'Description',
      'Type',
      'Category',
      'Priority',
      'Start Date',
      'End Date',
      'Exam Date',
      'Result Date',
      'Counseling Start',
      'Counseling End',
      'Application Fee',
      'Website',
      'Contact Phone',
      'Contact Email',
      'Status'
    ];

    const csvRows = [headers.join(',')];

    events.forEach(event => {
      const row = [
        `"${this.escapeCSVText(event.title)}"`,
        `"${this.escapeCSVText(event.description)}"`,
        `"${event.type}"`,
        `"${event.category}"`,
        `"${event.priority}"`,
        `"${this.formatDateCSV(event.dates.start)}"`,
        `"${this.formatDateCSV(event.dates.end)}"`,
        `"${event.dates.exam_date ? this.formatDateCSV(event.dates.exam_date) : ''}"`,
        `"${event.dates.result_date ? this.formatDateCSV(event.dates.result_date) : ''}"`,
        `"${event.dates.counseling_start ? this.formatDateCSV(event.dates.counseling_start) : ''}"`,
        `"${event.dates.counseling_end ? this.formatDateCSV(event.dates.counseling_end) : ''}"`,
        `"${event.fees.application_fee}"`,
        `"${event.website}"`,
        `"${event.contact.phone || ''}"`,
        `"${event.contact.email || ''}"`,
        `"${event.status}"`
      ];
      csvRows.push(row.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { 
      type: 'text/csv;charset=utf-8' 
    });
    
    this.downloadFile(blob, filename);
  }

  /**
   * Generate JSON export for backup/import
   */
  generateJSON(events: TimelineEvent[], filename: string = 'timeline-events.json'): void {
    const exportData = {
      version: '1.0',
      exported_at: new Date().toISOString(),
      source: 'EdVise Timeline Tracker',
      events: events
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json;charset=utf-8' 
    });
    
    this.downloadFile(blob, filename);
  }

  /**
   * Create sharing URLs for multiple calendars
   */
  generateSharingUrls(event: TimelineEvent) {
    return {
      google: this.generateGoogleCalendarUrl(event),
      outlook: this.generateOutlookCalendarUrl(event),
      yahoo: this.generateYahooCalendarUrl(event),
      copy: this.generateShareText(event)
    };
  }

  /**
   * Generate Yahoo Calendar URL
   */
  private generateYahooCalendarUrl(event: TimelineEvent): string {
    const calEvent = this.convertToCalendarEvent(event);
    const baseUrl = 'https://calendar.yahoo.com/';
    
    const params = new URLSearchParams({
      v: '60',
      view: 'd',
      type: '20',
      title: calEvent.title,
      desc: `${calEvent.description}\n\nWebsite: ${calEvent.url}`,
      st: this.formatYahooDate(calEvent.startDate),
      et: this.formatYahooDate(calEvent.endDate),
      in_loc: calEvent.location || ''
    });

    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * Generate plain text for sharing
   */
  private generateShareText(event: TimelineEvent): string {
    const calEvent = this.convertToCalendarEvent(event);
    return `📅 ${calEvent.title}\n\n` +
           `📝 ${calEvent.description}\n\n` +
           `🗓️ ${this.formatDateReadable(calEvent.startDate)} - ${this.formatDateReadable(calEvent.endDate)}\n\n` +
           `🔗 ${calEvent.url}\n\n` +
           `#EdVise #TimelineTracker #${event.category} #${event.type}`;
  }

  // Utility formatting methods
  private formatDateTimeICS(date: Date): string {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }

  private formatDateICS(date: Date): string {
    return date.toISOString().split('T')[0].replace(/-/g, '');
  }

  private formatGoogleDate(date: Date): string {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }

  private formatYahooDate(date: Date): string {
    return Math.floor(date.getTime() / 1000).toString();
  }

  private formatDateCSV(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-IN');
  }

  private formatDateReadable(date: Date): string {
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  private escapeICSText(text: string): string {
    return text
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r');
  }

  private escapeCSVText(text: string): string {
    return text.replace(/"/g, '""');
  }

  private getPriorityNumber(priority: 'high' | 'medium' | 'low'): number {
    switch (priority) {
      case 'high': return 1;
      case 'medium': return 5;
      case 'low': return 9;
      default: return 5;
    }
  }

  private downloadFile(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Export filtered events based on user preferences
   */
  exportFilteredEvents(
    events: TimelineEvent[], 
    filters: {
      types?: string[];
      categories?: string[];
      priorities?: string[];
      dateRange?: { start: string; end: string };
    },
    format: 'ics' | 'csv' | 'json' = 'ics'
  ): void {
    let filteredEvents = [...events];

    // Apply filters
    if (filters.types && filters.types.length > 0) {
      filteredEvents = filteredEvents.filter(event => filters.types!.includes(event.type));
    }

    if (filters.categories && filters.categories.length > 0) {
      filteredEvents = filteredEvents.filter(event => filters.categories!.includes(event.category));
    }

    if (filters.priorities && filters.priorities.length > 0) {
      filteredEvents = filteredEvents.filter(event => filters.priorities!.includes(event.priority));
    }

    if (filters.dateRange) {
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      filteredEvents = filteredEvents.filter(event => {
        const eventStart = new Date(event.dates.start);
        return eventStart >= startDate && eventStart <= endDate;
      });
    }

    // Export based on format
    const timestamp = new Date().toISOString().split('T')[0];
    switch (format) {
      case 'ics':
        this.generateICS(filteredEvents, `edvise-timeline-${timestamp}.ics`);
        break;
      case 'csv':
        this.generateCSV(filteredEvents, `edvise-timeline-${timestamp}.csv`);
        break;
      case 'json':
        this.generateJSON(filteredEvents, `edvise-timeline-${timestamp}.json`);
        break;
    }
  }

  /**
   * Get export statistics
   */
  getExportStats(events: TimelineEvent[]) {
    const stats = {
      total: events.length,
      by_type: {} as Record<string, number>,
      by_category: {} as Record<string, number>,
      by_priority: {} as Record<string, number>,
      upcoming: 0,
      past: 0
    };

    const now = new Date();

    events.forEach(event => {
      // Count by type
      stats.by_type[event.type] = (stats.by_type[event.type] || 0) + 1;
      
      // Count by category
      stats.by_category[event.category] = (stats.by_category[event.category] || 0) + 1;
      
      // Count by priority
      stats.by_priority[event.priority] = (stats.by_priority[event.priority] || 0) + 1;

      // Count upcoming vs past
      if (new Date(event.dates.start) > now) {
        stats.upcoming++;
      } else {
        stats.past++;
      }
    });

    return stats;
  }
}

// Export singleton instance
export const calendarExportService = new CalendarExportService();
export default calendarExportService;