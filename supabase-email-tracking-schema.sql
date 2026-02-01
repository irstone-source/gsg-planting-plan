-- Email onboarding tracking table
CREATE TABLE IF NOT EXISTS email_onboarding_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  email_type TEXT NOT NULL CHECK (email_type IN (
    'welcome',
    'quick_win_day1',
    'inspiration_day3',
    'urgency_day7',
    'care_reminder_monthly'
  )),
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  resend_id TEXT,
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'bounced')),
  error_message TEXT,
  UNIQUE(user_id, email_type)
);

CREATE INDEX idx_email_log_user ON email_onboarding_log(user_id);
CREATE INDEX idx_email_log_type ON email_onboarding_log(email_type);
CREATE INDEX idx_email_log_sent ON email_onboarding_log(sent_at);

-- Enable RLS
ALTER TABLE email_onboarding_log ENABLE ROW LEVEL SECURITY;

-- Only admins can read email logs (users shouldn't see this table)
CREATE POLICY "Admins can view email logs" ON email_onboarding_log FOR SELECT
  USING (auth.uid() IN (
    SELECT id FROM user_profiles WHERE role = 'admin'
  ));
