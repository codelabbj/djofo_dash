import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

const services = [
  {
    id: 1,
    title: "Web Development",
    description: "Custom web applications and websites",
    icon: "🌐",
  },
  {
    id: 2,
    title: "Mobile Development",
    description: "Native and cross-platform mobile apps",
    icon: "📱",
  },
  {
    id: 3,
    title: "UI/UX Design",
    description: "User interface and experience design",
    icon: "🎨",
  },
  {
    id: 4,
    title: "Digital Marketing",
    description: "SEO, social media, and content marketing",
    icon: "📈",
  },
];

export default function ServicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Services</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your service offerings
          </p>
        </div>
        <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Add Service
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card key={service.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{service.title}</CardTitle>
                <span className="text-2xl">{service.icon}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {service.description}
              </p>
              <div className="mt-4 flex space-x-2">
                <button className="rounded-md bg-accent px-3 py-1 text-sm text-accent-foreground hover:bg-accent/90">
                  Edit
                </button>
                <button className="rounded-md bg-destructive px-3 py-1 text-sm text-destructive-foreground hover:bg-destructive/90">
                  Delete
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 