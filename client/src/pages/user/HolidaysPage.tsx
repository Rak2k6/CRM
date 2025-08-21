import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, Sparkles } from "lucide-react";
import { Loader2 } from "lucide-react";

interface Holiday {
  id: number;
  name: string;
  date: string;
  description?: string;
  type: "public" | "optional" | "company";
  isActive: boolean;
  createdAt: string;
}

const typeColors = {
  public: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  optional: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  company: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
};

const typeLabels = {
  public: "Public Holiday",
  optional: "Optional Holiday", 
  company: "Company Holiday"
};

// Fallback static holidays data in case the API doesn't return any data
const staticHolidays = [
  {
    id: 1,
    name: "New Year's Day",
    date: "2025-01-01",
    description: "Beginning of the new calendar year",
    type: "public" as const,
    isActive: true,
    createdAt: "2024-01-01"
  },
  {
    id: 2,
    name: "Republic Day",
    date: "2025-01-26",
    description: "Celebrates the date when Constitution of India came into effect",
    type: "public" as const,
    isActive: true,
    createdAt: "2024-01-01"
  },
  {
    id: 3,
    name: "Independence Day",
    date: "2025-08-15",
    description: "Commemorates India's independence from British rule",
    type: "public" as const,
    isActive: true,
    createdAt: "2024-01-01"
  },
  {
    id: 4,
    name: "Gandhi Jayanti",
    date: "2025-10-02",
    description: "Birthday of Mahatma Gandhi",
    type: "public" as const,
    isActive: true,
    createdAt: "2024-01-01"
  },
  {
    id: 5,
    name: "Diwali",
    date: "2025-10-31",
    description: "Festival of lights celebrated across India",
    type: "public" as const,
    isActive: true,
    createdAt: "2024-01-01"
  },
  {
    id: 6,
    name: "Christmas Day",
    date: "2025-12-25",
    description: "Celebrates the birth of Jesus Christ",
    type: "public" as const,
    isActive: true,
    createdAt: "2024-01-01"
  },
  {
    id: 7,
    name: "LDR Surveys Foundation Day",
    date: "2025-03-15",
    description: "Anniversary of LDR Surveys establishment",
    type: "company" as const,
    isActive: true,
    createdAt: "2024-01-01"
  },
  {
    id: 8,
    name: "Team Building Day",
    date: "2025-06-15",
    description: "Annual company team building activities",
    type: "company" as const,
    isActive: true,
    createdAt: "2024-01-01"
  }
];

export function HolidaysPage() {
  const { data: holidays = [], isLoading, error } = useQuery({
    queryKey: ["/api/holidays"],
    retry: 1,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  // Use static holidays if API fails or returns empty data
  const displayHolidays = holidays.length > 0 ? holidays : staticHolidays;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isUpcoming = (dateString: string) => {
    const today = new Date();
    const holidayDate = new Date(dateString);
    return holidayDate >= today;
  };

  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    const holidayDate = new Date(dateString);
    const diffTime = holidayDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const upcomingHolidays = displayHolidays.filter((holiday: Holiday) => isUpcoming(holiday.date));
  const pastHolidays = displayHolidays.filter((holiday: Holiday) => !isUpcoming(holiday.date));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Holidays & Circulars</h1>
        <p className="text-muted-foreground">
          View company holidays and important announcements
        </p>
      </div>

      {error && (
        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20">
          <CardContent className="pt-4">
            <p className="text-yellow-800 dark:text-yellow-200 text-sm">
              Note: Displaying default holiday calendar. Contact admin if you need updates.
            </p>
          </CardContent>
        </Card>
      )}

      {upcomingHolidays.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-blue-500" />
              <span>Upcoming Holidays</span>
            </CardTitle>
            <CardDescription>
              Plan ahead for these upcoming holidays and events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {upcomingHolidays
                .sort((a: Holiday, b: Holiday) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((holiday: Holiday) => {
                  const daysUntil = getDaysUntil(holiday.date);
                  return (
                    <div
                      key={holiday.id}
                      className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20"
                      data-testid={`holiday-${holiday.id}`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold text-lg" data-testid={`holiday-name-${holiday.id}`}>
                            {holiday.name}
                          </h3>
                          <Badge className={typeColors[holiday.type]}>
                            {typeLabels[holiday.type]}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(holiday.date)}
                          </span>
                          {daysUntil >= 0 && (
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {daysUntil === 0 ? "Today" : daysUntil === 1 ? "Tomorrow" : `${daysUntil} days away`}
                            </span>
                          )}
                        </div>
                        {holiday.description && (
                          <p className="text-sm text-muted-foreground" data-testid={`holiday-description-${holiday.id}`}>
                            {holiday.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>All Holidays ({new Date().getFullYear()})</span>
          </CardTitle>
          <CardDescription>
            Complete list of holidays for the current year
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {displayHolidays
              .sort((a: Holiday, b: Holiday) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map((holiday: Holiday) => {
                const upcoming = isUpcoming(holiday.date);
                return (
                  <div
                    key={holiday.id}
                    className={`border rounded-lg p-4 transition-all ${
                      upcoming 
                        ? "border-blue-200 bg-blue-50/30 dark:border-blue-800 dark:bg-blue-950/10" 
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                    data-testid={`all-holiday-${holiday.id}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className={`font-medium ${upcoming ? "text-blue-900 dark:text-blue-100" : ""}`}>
                            {holiday.name}
                          </h3>
                          <Badge className={typeColors[holiday.type]} variant="outline">
                            {typeLabels[holiday.type]}
                          </Badge>
                          {!upcoming && (
                            <Badge variant="outline" className="text-xs">
                              Past
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(holiday.date)}</span>
                        </div>
                        {holiday.description && (
                          <p className="text-sm text-muted-foreground">
                            {holiday.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-green-600" />
            <span>LDR Surveys Office Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm"><strong>Operating Hours:</strong> Sunday to Saturday, 9:30 AM - 6:30 PM</p>
            <p className="text-sm"><strong>24/7 Availability:</strong> Emergency survey services available</p>
            <p className="text-sm"><strong>Location:</strong> Tamil Nadu, Kerala, Karnataka, and Andhra Pradesh</p>
            <p className="text-sm"><strong>Contact:</strong> +91 9840281288 | lands@landsurveys.in</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}