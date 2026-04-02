import { supabase } from "@/integrations/supabase/client";
import emailjs from '@emailjs/browser';

export async function saveAssessmentLead(data: {
  name: string;
  email: string;
  phone?: string;
  stress_score: number;
  stress_level: string;
}) {
  const { error } = await supabase.from("leads").insert([{
    name: data.name,
    email: data.email,
    company: "N/A",
    designation: "N/A",
    score: data.stress_score,
    band: data.stress_level,
    audit_pref: false
  }]);
  if (error) {
    console.error("Error saving lead:", error);
    throw error;
  }
  
  try {
     emailjs.init("bAYpz4FeLe7GTJWM8");
     await emailjs.send("service_7434fac", "template_12ssup8", {
         to_email: data.email,
         to_name: data.name,
         score: data.stress_score,
         band: data.stress_level
     });
  } catch(e) {
     console.error("EmailJS error", e);
  }
}
