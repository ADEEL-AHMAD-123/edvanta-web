import { Hammer } from 'lucide-react';
import { PageHeader } from './page-header';
import { Card } from './card';
import { EmptyState } from './empty-state';
import { Badge } from './badge';

export function ComingSoon({ title }: { title: string }) {
  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        description="This section is part of the Edvanta roadmap."
        actions={<Badge variant="primary">Coming soon</Badge>}
      />
      <Card>
        <EmptyState
          icon={Hammer}
          title={`${title} is under construction`}
          description="The interface and theming are ready — data and workflows for this module are being wired up next."
        />
      </Card>
    </div>
  );
}
