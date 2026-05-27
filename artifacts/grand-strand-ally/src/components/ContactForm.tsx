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

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setLocation("/thank-you");
    }, 1000);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Jane Doe" {...field} />
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
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input placeholder="jane@company.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input placeholder="Company Name" {...field} />
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
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="843-555-0199" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="teamSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team Size</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select team size" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1-5">1-5</SelectItem>
                    <SelectItem value="6-15">6-15</SelectItem>
                    <SelectItem value="16-50">16-50</SelectItem>
                    <SelectItem value="50+">50+</SelectItem>
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
                <FormLabel>What do you need help with?</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="IT Support">IT Support</SelectItem>
                    <SelectItem value="Microsoft 365">Microsoft 365</SelectItem>
                    <SelectItem value="Network/Wi-Fi">Network/Wi-Fi</SelectItem>
                    <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                    <SelectItem value="Backup & Recovery">Backup & Recovery</SelectItem>
                    <SelectItem value="Automation">Automation</SelectItem>
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
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea placeholder="How can we help?" className="min-h-[120px] resize-y" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-white h-12 text-base font-semibold mt-4" disabled={isSubmitting}>
          {isSubmitting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sending...</> : "Send Message"}
        </Button>
      </form>
    </Form>
  );
}
