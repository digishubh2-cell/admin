import {
  dashboardStats,
  recentActivity,
  recentLeads,
} from "@/constants/admin-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function DashboardContent() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="type-h2">Dashboard</h1>
        <p className="type-body-sm mt-2 text-admin-text-secondary">
          Overview of leads, content, projects, and platform health.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <Card key={stat.label} className="transition-shadow hover:shadow-md">
            <CardHeader className="pb-2">
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="type-metric text-3xl">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className={cn(
                  "text-sm font-medium",
                  stat.trend === "up" ? "text-success" : "text-danger"
                )}
              >
                {stat.change} vs last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Recent Leads</CardTitle>
            <CardDescription>Latest inbound opportunities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLeads.map((lead) => (
                <div
                  key={lead.name}
                  className="flex items-center justify-between rounded-xl border border-admin-border px-4 py-3"
                >
                  <div>
                    <p className="font-medium">{lead.name}</p>
                    <p className="text-sm text-admin-text-muted">{lead.company}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{lead.status}</p>
                    <p className="type-tech text-admin-text-muted">{lead.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Platform events and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((item) => (
                <div key={item.detail} className="border-l-2 border-primary/30 pl-4">
                  <p className="text-sm font-medium">{item.action}</p>
                  <p className="text-sm text-admin-text-secondary">{item.detail}</p>
                  <p className="type-tech mt-1 text-admin-text-muted">{item.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Traffic</CardTitle>
            <CardDescription>Last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-32 items-end gap-2">
              {[40, 65, 45, 80, 55, 90, 70].map((height, index) => (
                <div
                  key={index}
                  className="flex-1 rounded-t-lg bg-primary/20"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
            <CardDescription>Delivery status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between"><span>In Progress</span><strong>12</strong></div>
            <div className="flex justify-between"><span>Review</span><strong>6</strong></div>
            <div className="flex justify-between"><span>Completed</span><strong>20</strong></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Core services</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="type-tech">API</span>
              <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                Operational
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Database</span>
              <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                Operational
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Media CDN</span>
              <span className="rounded-full bg-warning/10 px-2 py-0.5 text-xs font-medium text-warning">
                Degraded
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
