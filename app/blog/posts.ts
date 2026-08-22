export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO
  readingTime: string;
  body: string[]; // paragraphs; a leading "## " marks a subheading
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'moving-from-registers-to-digital-attendance',
    title: 'Moving From Paper Registers to Digital Attendance: A Practical Guide',
    description:
      'A step-by-step plan for schools and academies in Pakistan switching from paper attendance registers to a digital system, without disrupting the school day.',
    date: '2026-08-15',
    readingTime: '5 min read',
    body: [
      'Most schools and academies in Pakistan still take attendance the same way they did decades ago: a paper register, a pen, and a teacher counting heads at the start of class. It works, but it comes with real costs — registers get lost or damaged, attendance percentages have to be calculated by hand at the end of term, and parents only find out their child was absent if someone happens to call them.',
      '## Why switch at all',
      'The case for digital attendance isn\'t about looking modern — it\'s about the specific problems a register can\'t solve. A register can\'t tell an admin in real time which sections are running low on attendance this week. It can\'t notify a parent the same day their child misses class. And it can\'t produce an accurate termly attendance report without someone manually adding up rows in a book.',
      '## Start with one class, not the whole school',
      'The most common mistake schools make is trying to switch every class over on the same day. Pick one section — ideally a teacher who\'s comfortable with a phone or tablet — and run it in parallel with the paper register for a week. This gives your staff a low-risk way to get comfortable with the new flow, and gives you a chance to catch any gaps (a class list that\'s out of date, a section that was never digitized) before it affects the whole school.',
      '## Get your student list right first',
      'Digital attendance is only as good as the student list behind it. Before switching a class over, make sure every student is enrolled with the correct section — this is usually the single biggest source of frustration in week one, when a teacher opens their attendance screen and a student is missing or listed under the wrong class. A bulk CSV import at the start, rather than adding students one by one, avoids most of this entirely.',
      '## Decide who gets notified, and how',
      'Once attendance is digital, you can notify parents automatically when their child is marked absent — but it\'s worth deciding upfront whether that should happen for every absence or only after a pattern (say, two unexplained absences in a week). Notifying on every single absence can feel excessive for a school with lenient late-arrival policies; for others, same-day notification is exactly the point.',
      '## Give it a full month before judging it',
      'Teachers who\'ve marked attendance on paper for years will be faster at it for the first week or two — that\'s normal, not a sign it isn\'t working. The real payoff shows up at reporting time: instead of a staff member spending a day adding up a term\'s worth of registers by hand, an admin can pull an accurate attendance report in seconds.',
    ],
  },
  {
    slug: 'whatsapp-for-parent-communication-in-pakistan',
    title: 'Why WhatsApp Is the Right Channel for Parent Communication in Pakistan',
    description:
      'Schools in Pakistan already reach parents through WhatsApp groups. Here\'s how to do it in a way that scales past a few hundred students without becoming unmanageable.',
    date: '2026-08-10',
    readingTime: '4 min read',
    body: [
      'Walk into almost any private school or academy staff room in Pakistan and you\'ll find at least one WhatsApp group per class, run by a teacher or the class parent representative. It\'s not an accident — WhatsApp is where parents already are, and for a school, meeting parents on a channel they already check daily beats asking them to install a separate app or check a portal they\'ll forget about.',
      '## The problem with class WhatsApp groups at scale',
      'A single class group works fine. The trouble starts as a school grows: fifteen sections means fifteen groups to manage, fifteen places a fee reminder or a notice has to be posted separately, and no record of who actually received what. A parent who leaves a group, or a teacher who goes on leave mid-term, quietly breaks the whole communication chain for that section.',
      '## What a structured system adds',
      'The fix isn\'t abandoning WhatsApp — it\'s sending through it in a structured way instead of a manual group chat. A notice sent from a school management system can go out to every parent in a class, a whole grade, or the entire school, from one screen, with a delivery log showing who it reached. An attendance alert, a fee reminder, or an exam result can trigger automatically, in Urdu or English, without a staff member typing it out fifteen times.',
      '## What this looks like in practice',
      'A fee due-date reminder goes out three days before, one day before, and on the day itself, without anyone remembering to send it. An attendance alert reaches a parent the same afternoon their child was marked absent. A results announcement reaches every parent in a grade the moment marks are published, instead of a notice pinned to a board at the school gate.',
      '## The channel matters less than the structure',
      'None of this requires parents to change behavior — they still get a WhatsApp message, the same way they always have. What changes is what\'s behind it: one system sending it, one log of what went out, and no dependency on a single teacher\'s phone to keep a class connected.',
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
