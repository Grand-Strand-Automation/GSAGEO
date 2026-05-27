import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  company: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  teamSize: z.string().optional(),
  helpWith: z.string().optional(),
  message: z.string().optional()
});

export function ContactForm() {
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
      teamSize: "",
      helpWith: "",
      message: ""
    }
  });

  function onSubmit(_values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setLocation("/thank-you");
    }, 1000);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-[#0E2F54]">Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Jane Doe" className="h-11" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-[#0E2F54]">Email *</FormLabel>
                <FormControl>
                  <Input placeholder="jane@company.com" className="h-11" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-[#0E2F54]">Company</FormLabel>
                <FormControl>
                  <Input placeholder="Company Name" className="h-11" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-[#0E2F54]">Phone</FormLabel>
                <FormControl>
                  <Input placeholder="843-555-0199" className="h-11" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            control={form.control}
            name="teamSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-[#0E2F54]">Team Size</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select team size" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1-5">1–5 employees</SelectItem>
                    <SelectItem value="6-15">6–15 employees</SelectItem>
                    <SelectItem value="16-50">16–50 employees</SelectItem>
                    <SelectItem value="50+">50+ employees</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="helpWith"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-[#0E2F54]">What can we help with?</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Cost Analysis">Free Cost Analysis</SelectItem>
                    <SelectItem value="IT Support">Managed IT Support</SelectItem>
                    <SelectItem value="Microsoft 365">Microsoft 365</SelectItem>
                    <SelectItem value="Cybersecurity & Compliance">Cybersecurity & Compliance</SelectItem>
                    <SelectItem value="Network/Wi-Fi">Network & Wi-Fi</SelectItem>
                    <SelectItem value="Backup & Recovery">Backup & Recovery</SelectItem>
                    <SelectItem value="Automation & Onboarding">Automation & On/Offboarding</SelectItem>
                    <SelectItem value="Something Else">Something Else</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-[#0E2F54]">Tell us about your current situation</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What tools or vendors are you currently using? Any concerns about IT costs, support quality, or compliance?"
                  className="min-h-[120px] resize-y"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-[#1F5E95] hover:bg-[#1a5080] text-white h-12 text-base font-semibold rounded-lg mt-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sending...</> : "Book a Free Cost Analysis →"}
        </Button>
      </form>
    </Form>
  );
}
