import { Html, Head, Body, Container, Section, Text, Button, Heading, Hr } from '@react-email/components';

interface WelcomeEmailProps {
  name: string;
  tier: 'diy' | 'pro';
  credits: number;
  vaultSlots: number;
  expiresAt: string;
}

export function WelcomeEmail({ name, tier, credits, vaultSlots, expiresAt }: WelcomeEmailProps) {
  const expiryDate = new Date(expiresAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to PlantingPlans! 🎉</Heading>

          <Text style={text}>
            Hi {name || 'there'},
          </Text>

          <Text style={text}>
            Your <strong>{tier.toUpperCase()} Activation Pass</strong> is now active. Here's what you have:
          </Text>

          <Section style={statsContainer}>
            <div style={statBox}>
              <Text style={statLabel}>Plan Credits</Text>
              <Text style={statValue}>{credits}</Text>
              <Text style={statSubtext}>Generate complete planting plans</Text>
            </div>
            <div style={statBox}>
              <Text style={statLabel}>Vault Slots</Text>
              <Text style={statValue}>{vaultSlots}</Text>
              <Text style={statSubtext}>Save plans permanently</Text>
            </div>
            <div style={statBox}>
              <Text style={statLabel}>Access Until</Text>
              <Text style={statValue}>{expiryDate}</Text>
              <Text style={statSubtext}>3 months to create plans</Text>
            </div>
          </Section>

          <Section style={buttonContainer}>
            <Button style={button} href={`${process.env.NEXT_PUBLIC_APP_URL}/create?source=welcome-email`}>
              Create Your First Plan Now →
            </Button>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            <strong>Pro tip:</strong> Start by creating your first plan to get familiar with the system.
            You can regenerate as many times as you need within your credit limit.
          </Text>

          <Text style={footer}>
            Questions? Reply to this email anytime.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

interface QuickWinEmailProps {
  name: string;
  credits: number;
}

export function QuickWinEmail({ name, credits }: QuickWinEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Ready for a Quick Win? ⚡</Heading>

          <Text style={text}>
            Hi {name || 'there'},
          </Text>

          <Text style={text}>
            You have <strong>{credits} plan credits</strong> ready to use. Let's create your first plan in just 3 minutes.
          </Text>

          <Text style={text}>
            Here's how it works:
          </Text>

          <ol style={list}>
            <li style={listItem}>Upload a photo of your garden space (or describe it)</li>
            <li style={listItem}>Tell us about soil type, sunlight, and your style preferences</li>
            <li style={listItem}>Get a complete planting plan with plant recommendations, spacing, and care instructions</li>
          </ol>

          <Section style={buttonContainer}>
            <Button style={button} href={`${process.env.NEXT_PUBLIC_APP_URL}/create?source=day1-email`}>
              Create My First Plan →
            </Button>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            Not sure where to start? <a href={`${process.env.NEXT_PUBLIC_APP_URL}/examples/hub`} style={link}>Browse example plans</a> first.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

interface InspirationEmailProps {
  name: string;
  hasCreatedPlan: boolean;
}

export function InspirationEmail({ name, hasCreatedPlan }: InspirationEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Inspiration from Real Gardens 🌿</Heading>

          <Text style={text}>
            Hi {name || 'there'},
          </Text>

          {!hasCreatedPlan && (
            <Text style={text}>
              We noticed you haven't created your first plan yet. No worries! Sometimes seeing what's possible helps spark ideas.
            </Text>
          )}

          <Text style={text}>
            Here are some popular plans from our community:
          </Text>

          <Section style={exampleBox}>
            <Text style={exampleTitle}>Edinburgh Wildlife Haven</Text>
            <Text style={exampleDesc}>
              Small urban garden (20m²) transformed into a native wildlife sanctuary.
              Low-maintenance plants that attract bees and butterflies year-round.
            </Text>
            <a href={`${process.env.NEXT_PUBLIC_APP_URL}/examples/edinburgh-wildlife-haven`} style={link}>
              View Plan →
            </a>
          </Section>

          <Section style={buttonContainer}>
            <Button style={button} href={`${process.env.NEXT_PUBLIC_APP_URL}/examples/hub`}>
              Browse All Examples
            </Button>
          </Section>

          {!hasCreatedPlan && (
            <>
              <Hr style={hr} />
              <Text style={footer}>
                Ready to create your own? <a href={`${process.env.NEXT_PUBLIC_APP_URL}/create`} style={link}>Start here</a>.
              </Text>
            </>
          )}
        </Container>
      </Body>
    </Html>
  );
}

interface UrgencyEmailProps {
  name: string;
  creditsRemaining: number;
  daysUntilExpiry: number;
}

export function UrgencyEmail({ name, creditsRemaining, daysUntilExpiry }: UrgencyEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Don't Lose Your Credits ⚠️</Heading>

          <Text style={text}>
            Hi {name || 'there'},
          </Text>

          <Text style={text}>
            Just a friendly reminder: your activation pass expires in <strong>{daysUntilExpiry} days</strong>,
            and you still have <strong>{creditsRemaining} plan credits</strong> remaining.
          </Text>

          {creditsRemaining > 0 && (
            <>
              <Section style={warningBox}>
                <Text style={warningText}>
                  💡 Your credits expire with your pass. Use them before they're gone!
                </Text>
              </Section>

              <Section style={buttonContainer}>
                <Button style={button} href={`${process.env.NEXT_PUBLIC_APP_URL}/create?source=urgency-email`}>
                  Use My Credits Now
                </Button>
              </Section>
            </>
          )}

          <Hr style={hr} />

          <Text style={footer}>
            <strong>Remember:</strong> Plans saved to your vault remain accessible forever, even after your pass expires.
          </Text>

          <Text style={footer}>
            Want to extend? <a href={`${process.env.NEXT_PUBLIC_APP_URL}/pricing`} style={link}>View pricing options</a>.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

interface CareReminderEmailProps {
  name: string;
  savedPlans: Array<{ title: string; slug: string }>;
  monthName: string;
}

export function CareReminderEmail({ name, savedPlans, monthName }: CareReminderEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Your {monthName} Garden Care Reminder 🌱</Heading>

          <Text style={text}>
            Hi {name || 'there'},
          </Text>

          <Text style={text}>
            It's time for your monthly garden care check-in. Here are the key tasks for {monthName}:
          </Text>

          <Section style={careTaskBox}>
            <Text style={careTaskTitle}>General Tasks for {monthName}:</Text>
            <ul style={list}>
              <li style={listItem}>Check for pest damage and treat if needed</li>
              <li style={listItem}>Water during dry spells (1-2 inches per week)</li>
              <li style={listItem}>Weed regularly to prevent competition</li>
              <li style={listItem}>Apply mulch to retain moisture</li>
            </ul>
          </Section>

          {savedPlans.length > 0 && (
            <Section>
              <Text style={text}>
                <strong>Your Saved Plans:</strong>
              </Text>
              {savedPlans.map((plan, idx) => (
                <div key={idx} style={planLink}>
                  <a href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard#${plan.slug}`} style={link}>
                    • {plan.title}
                  </a>
                </div>
              ))}
            </Section>
          )}

          <Hr style={hr} />

          <Text style={footer}>
            Want specific care instructions for your plants? View your saved plans in your <a href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`} style={link}>dashboard</a>.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const h1 = {
  color: '#0F1110',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0 40px',
};

const text = {
  color: '#484848',
  fontSize: '16px',
  lineHeight: '26px',
  padding: '0 40px',
};

const statsContainer = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '20px 40px',
  gap: '16px',
};

const statBox = {
  textAlign: 'center' as const,
  padding: '16px',
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  flex: '1',
};

const statLabel = {
  fontSize: '12px',
  color: '#71717A',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  margin: '0 0 8px 0',
};

const statValue = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#C08B5C',
  margin: '0',
};

const statSubtext = {
  fontSize: '12px',
  color: '#71717A',
  margin: '4px 0 0 0',
};

const buttonContainer = {
  padding: '27px 40px',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#C08B5C',
  borderRadius: '4px',
  color: '#0F1110',
  fontSize: '14px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '100%',
  padding: '16px',
  fontWeight: 'bold',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 40px',
};

const footer = {
  color: '#71717A',
  fontSize: '14px',
  lineHeight: '24px',
  padding: '0 40px',
  marginTop: '12px',
};

const link = {
  color: '#C08B5C',
  textDecoration: 'underline',
};

const list = {
  paddingLeft: '20px',
  margin: '16px 40px',
};

const listItem = {
  marginBottom: '12px',
  color: '#484848',
  fontSize: '16px',
  lineHeight: '26px',
};

const exampleBox = {
  backgroundColor: '#f9fafb',
  border: '1px solid #e6ebf1',
  borderRadius: '8px',
  padding: '24px',
  margin: '20px 40px',
};

const exampleTitle = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#0F1110',
  margin: '0 0 8px 0',
};

const exampleDesc = {
  fontSize: '14px',
  color: '#71717A',
  lineHeight: '22px',
  margin: '0 0 12px 0',
};

const warningBox = {
  backgroundColor: '#FEF3C7',
  border: '1px solid #F59E0B',
  borderRadius: '8px',
  padding: '16px 24px',
  margin: '20px 40px',
};

const warningText = {
  fontSize: '14px',
  color: '#92400E',
  margin: '0',
};

const careTaskBox = {
  backgroundColor: '#E8F5E9',
  border: '1px solid #4CAF50',
  borderRadius: '8px',
  padding: '20px 24px',
  margin: '20px 40px',
};

const careTaskTitle = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#1B5E20',
  margin: '0 0 12px 0',
};

const planLink = {
  padding: '8px 40px',
};
