import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui/page-header';
import { TeachNowCard } from '@/components/timetable/TeachNowCard';

export const metadata: Metadata = { title: 'Teacher Dashboard' };

export default function TeacherDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Welcome back"
        description="Here's your day at a glance."
      />
      <TeachNowCard />
    </div>
  );
}
