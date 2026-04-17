import React from "react";

type LegalProps = {
  title: string;
  sections: string[];
};

export default function Legal({ title, sections }: LegalProps) {
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-10 uppercase tracking-tight">{title}</h1>
        <div className="space-y-6">
          {sections.map((section, idx) => (
            <div key={idx} className="bg-zinc-900 border border-white/10 rounded-lg p-6">
              <p className="text-gray-300 whitespace-pre-line text-sm leading-relaxed">{section}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const termsSections = [
  "1. Introduction\nWelcome to JP Olympia Table Tennis Academy. By enrolling in our academy, you agree to abide by these terms.",
  "2. Enrollment & Fees\nEnrollment is open to all skill levels subject to slots. Fees are paid in advance. Fees are non-refundable except academy-approved special cases. Fee revisions may happen with prior notice.",
  "3. Code of Conduct\nStudents must respect coaches, staff, and peers. Misconduct may lead to suspension/expulsion. Proper sports attire and coach safety instructions are mandatory.",
  "4. Training Sessions & Attendance\nStudents should attend punctually. Absences should be informed in advance. Missed sessions are not compensated except exceptional approved cases.",
  "5. Health & Safety\nParticipants must declare medical conditions before enrollment. Academy is not responsible for injuries during training, though first aid is provided. Personal accident insurance is recommended.",
  "6. Equipment & Facility Usage\nEquipment must be handled carefully. Negligence-related damage is chargeable. Premises cleanliness and discipline must be maintained.",
  "7. Competitions & External Events\nTournament participation is coach-approved. Players must show sportsmanship while representing JPOTTA. External event costs are not academy liability unless explicitly stated.",
  "8. Photography & Media\nAcademy may capture photos/videos for promotion. Opt-out requires written request in advance.",
  "9. Cancellation & Termination\nAcademy may cancel classes due to unforeseen situations with make-up sessions where possible. Rule violations may result in termination. Withdrawal should be informed in writing.",
  "10. Amendments\nJP Olympia Table Tennis Academy reserves the right to modify terms at any time and will communicate updates through official channels.",
];

export const privacySections = [
  "1. Introduction\nJP Olympia Table Tennis Academy is committed to protecting privacy of students, parents, and staff.",
  "2. Information We Collect\nName, age, contact details, address, emergency contact, relevant medical info, payment details, and photos/videos (with consent).",
  "3. How We Use Information\nEnrollment and records, communication, emergency contact, payment processing/invoicing, and promotion with consent.",
  "4. Data Protection & Security\nReasonable protection is maintained. Access is restricted to authorized personnel. We do not sell/rent personal information.",
  "5. Third-Party Services\nSecure providers may process payments. Limited information may be shared for external tournament registration.",
  "6. Data Retention\nData retained only as necessary for operations and legal obligations.",
  "7. Your Rights\nYou can request access, correction, or deletion by contacting academy administration.",
  "8. Policy Changes\nUpdates may be made and communicated through official channels.",
];

export const refundSections = [
  "1. General Policy\nWe aim for transparent and fair cancellation/refund handling.",
  "2. Coaching Programs\nBefore session starts: 90% refund (10% admin deduction). Within first 7 days: 50% refund. After 7 days: no refund. Missed classes are not refundable/carry-forward unless academy cancellation where make-up is scheduled.",
  "3. Private Coaching\n24+ hours cancellation: full credit for reschedule. Within 24 hours: 50% deduction. No-shows: no refund/reschedule.",
  "4. Tournament & Event Fees\nNon-refundable unless event cancelled by academy/governing body. Medical exception may be considered with proof.",
  "5. Equipment & Merchandise\nDefective/unused products can be returned within 7 days for refund/exchange. Used/damaged due to misuse and personalized items are non-refundable unless defective.",
  "6. Academy-Initiated Cancellations\nStudents receive full refund or fee transfer option.",
  "7. Refund Processing\nApproved refunds processed within 7–10 business days to original payment method.",
  "8. Amendments\nPolicy may be modified and notified via official channels. Contact: jpotta2018@gmail.com | +91 7045702200",
];

export const shippingSections = [
  "1. Products bought from JP Olympia Table Tennis Academy\nProducts are delivered same day when available, otherwise delivery timelines are shared based on availability.",
  "2. Coverage\nProducts are shipped all over India and final delivery date depends on courier partner timelines.",
  "3. Updates\nJP Olympia Table Tennis Academy reserves the right to modify this policy and communicate changes through official channels.",
  "For more information: jpotta2018@gmail.com | +91 7045702200",
];
