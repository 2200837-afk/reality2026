
import { createClient } from 'https://aistudiocdn.com/@supabase/supabase-js@^2.48.1';
import { UserProfile, AnalyticsEvent, LearningStyleType, FeedbackSubmission, VARKScores, QuizResult } from "../types";

const SUPABASE_URL = 'https://okzgkngvwjzmjiudpyjm.supabase.co';
const SUPABASE_KEY = 'sb_publishable_f3GT9N7fMcWoAQ3ePTrg-Q_1IrvDRLw';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const USER_KEY = 'rim_user_profile';
const SESSION_SEQ_KEY = 'rim_event_sequence';

class DatabaseService {
  private user: UserProfile | null = null;
  private lastEventTime: number = Date.now();
  private eventSequence: number = 0;

  constructor() {
    this.loadUser();
    this.eventSequence = parseInt(sessionStorage.getItem(SESSION_SEQ_KEY) || '0');
  }

  private loadUser() {
    const stored = localStorage.getItem(USER_KEY);
    if (stored) {
      this.user = JSON.parse(stored);
    }
  }

  public getUser(): UserProfile | null {
    return this.user;
  }

  public async saveUser(profile: UserProfile) {
    this.user = profile;
    localStorage.setItem(USER_KEY, JSON.stringify(profile));

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: profile.id,
        name: profile.name,
        email: profile.email,
        gender: profile.gender,
        age: profile.age,
        education: profile.education,
        university: profile.university,
        field_of_study: profile.fieldOfStudy,
        country: profile.country,
        session_count: profile.sessionCount,
        learning_style: profile.learningStyle || 'Unknown',
        vark_scores: profile.learningScores
      });

    if (error) console.error("Supabase Profile Sync Error:", error);
  }

  public async saveQuizResult(result: QuizResult) {
    if (!this.user) return;
    const { error } = await supabase
      .from('quiz_results')
      .insert({
        user_id: result.userId,
        score: result.score,
        total_questions: result.totalQuestions,
        accuracy_percent: (result.score / result.totalQuestions) * 100
      });
    if (error) console.error("Supabase Quiz Log Error:", error);
  }

  public async logEvent(event: Omit<AnalyticsEvent, 'userId' | 'timestamp' | 'interEventTime' | 'sequenceIndex'>) {
    if (!this.user) return;
    const now = Date.now();
    const interTime = (now - this.lastEventTime) / 1000;
    this.eventSequence++;
    sessionStorage.setItem(SESSION_SEQ_KEY, this.eventSequence.toString());

    const { error } = await supabase
      .from('events')
      .insert({
        user_id: this.user.id,
        event_type: event.eventType,
        target: event.target,
        value: event.value,
        inter_event_time: interTime,
        sequence_index: this.eventSequence,
        metadata: event.metadata,
        timestamp: new Date(now).toISOString()
      });
    this.lastEventTime = now;
    if (error) console.error("Supabase Event Log Error:", error);
  }

  public async saveFeedback(data: FeedbackSubmission) {
    if (!this.user) return;
    const { error } = await supabase
      .from('feedback')
      .insert({
        user_id: data.userId,
        ratings: data.ratings,
        open_ended: data.openEnded
      });
    if (error) console.error("Supabase Feedback Error:", error);
  }

  public async updateUserStyle(style: LearningStyleType, scores: VARKScores) {
    if (this.user) {
      this.user.learningStyle = style;
      this.user.learningScores = scores;
      await this.saveUser(this.user);
    }
  }

  public logout() {
    this.user = null;
    localStorage.removeItem(USER_KEY);
  }
}

export const db = new DatabaseService();
