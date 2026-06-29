'use client';

import { useState } from 'react';
import { MessageSquare, Send, Info, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table, TableWrapper, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from '@/components/ui/table';
import { formatDateTime } from '@/lib/utils';
import {
  useGetMessagingStatusQuery, useGetMessageLogQuery, useSendMessageMutation, type Channel,
} from '@/store/api/messagingApi';

const statusBadge: Record<string, 'success' | 'danger' | 'neutral'> = {
  sent: 'success', failed: 'danger', mock: 'neutral',
};

export function MessagingView() {
  const { data: statusRes } = useGetMessagingStatusQuery();
  const status = statusRes?.data;
  const { data: logRes, isLoading } = useGetMessageLogQuery({ limit: 25 });
  const logs = logRes?.data ?? [];
  const [sendMessage, { isLoading: sending }] = useSendMessageMutation();

  const [channel, setChannel] = useState<Channel>('sms');
  const [recipientsRaw, setRecipientsRaw] = useState('');
  const [message, setMessage] = useState('');

  const isMock = status ? status[channel] === 'mock' : false;
  const inputCls = 'h-10 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

  const parseRecipients = () =>
    recipientsRaw.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const recipients = parseRecipients();
    if (recipients.length === 0) return toast.error('Add at least one recipient');
    if (!message.trim()) return toast.error('Enter a message');
    try {
      const res = await sendMessage({ channel, recipients, message: message.trim() }).unwrap();
      const d = res.data;
      toast.success(`${d.sent}/${d.total} sent via ${d.provider}${d.failed ? ` · ${d.failed} failed` : ''}`);
      setMessage('');
      setRecipientsRaw('');
    } catch (err: any) {
      toast.error(err?.data?.error?.message || 'Could not send');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Messaging" description="Send SMS and WhatsApp messages to parents and staff." />

      {status && (
        <div className={`flex items-start gap-2.5 rounded-lg border px-3.5 py-3 text-sm ${isMock ? 'border-warning/30 bg-warning-soft text-warning' : 'border-success/30 bg-success-soft text-success'}`}>
          {isMock ? <AlertCircle size={17} className="mt-0.5 shrink-0" /> : <Info size={17} className="mt-0.5 shrink-0" />}
          <div>
            {isMock ? (
              <p><span className="font-medium">Test mode.</span> No provider keys detected for {channel.toUpperCase()} — messages are logged, not delivered. Add provider keys (Twilio, Meta WhatsApp, or Jazz SMS) to go live.</p>
            ) : (
              <p>Live — SMS via <span className="font-medium">{status.sms}</span>, WhatsApp via <span className="font-medium">{status.whatsapp}</span>.</p>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Compose */}
        <Card className="p-5 lg:col-span-2">
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label>Channel</Label>
              <select className={inputCls} value={channel} onChange={(e) => setChannel(e.target.value as Channel)}>
                <option value="sms">SMS</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
            </div>
            <div>
              <Label htmlFor="recipients">Recipients</Label>
              <textarea
                id="recipients"
                value={recipientsRaw}
                onChange={(e) => setRecipientsRaw(e.target.value)}
                rows={4}
                placeholder="03001234567, 03007654321 — one per line or comma-separated"
                className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <p className="mt-1 text-xs text-muted-foreground">{parseRecipients().length} recipient(s)</p>
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                maxLength={1000}
                placeholder="Type your message…"
                className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <p className="mt-1 text-xs text-muted-foreground">{message.length}/1000</p>
            </div>
            <Button type="submit" loading={sending} className="w-full"><Send size={16} /> Send</Button>
          </form>
        </Card>

        {/* Log */}
        <Card className="p-5 lg:col-span-3">
          <p className="mb-3 text-sm font-semibold text-foreground">Recent messages</p>
          {isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : logs.length === 0 ? (
            <EmptyState icon={MessageSquare} title="No messages yet" description="Sent messages will appear here." />
          ) : (
            <TableWrapper>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>To</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>When</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell className="font-medium text-foreground">{m.to}</TableCell>
                      <TableCell className="uppercase text-xs text-muted-foreground">{m.channel}</TableCell>
                      <TableCell className="max-w-[220px] truncate text-muted-foreground" title={m.message}>{m.message}</TableCell>
                      <TableCell><Badge variant={statusBadge[m.status]}>{m.status}</Badge></TableCell>
                      <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{formatDateTime(m.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableWrapper>
          )}
        </Card>
      </div>
    </div>
  );
}
