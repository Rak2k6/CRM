import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, CheckCircle, AlertTriangle, Clock, Users, Calendar } from "lucide-react";

export function RulesPage() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-700 dark:text-gray-200">
          Rules & Regulations
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          LDR Surveys company policies and guidelines for employees
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Working Hours */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-teal-600" />
              <CardTitle>Working Hours</CardTitle>
            </div>
            <CardDescription>Standard operating hours and schedule</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Regular Hours</span>
                <Badge variant="secondary">9:30 AM - 6:30 PM</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Days</span>
                <Badge variant="secondary">Sunday - Saturday</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Emergency Support</span>
                <Badge variant="outline">24/7 Available</Badge>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>• Lunch break: 1:00 PM - 2:00 PM</p>
              <p>• Tea breaks: 11:00 AM and 4:00 PM</p>
              <p>• Overtime must be pre-approved</p>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Policy */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <CardTitle>Attendance Policy</CardTitle>
            </div>
            <CardDescription>Punctuality and attendance requirements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Minimum 95% attendance required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Grace period: 15 minutes</span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <span className="text-sm">Late arrivals must be reported</span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="text-sm">Unauthorized absence not permitted</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leave Policy */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <CardTitle>Leave Policy</CardTitle>
            </div>
            <CardDescription>Annual leave and time-off guidelines</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">24</div>
                <div className="text-sm text-muted-foreground">Annual Leave Days</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">12</div>
                <div className="text-sm text-muted-foreground">Sick Leave Days</div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• Leave applications must be submitted 7 days in advance</p>
              <p>• Emergency leave requires immediate notification</p>
              <p>• Maximum 5 consecutive casual leaves</p>
              <p>• Medical certificate required for sick leave {'>'}  3 days</p>
            </div>
          </CardContent>
        </Card>

        {/* Professional Conduct */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-600" />
              <CardTitle>Professional Conduct</CardTitle>
            </div>
            <CardDescription>Workplace behavior and ethics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm space-y-2">
              <h4 className="font-medium">Required Conduct:</h4>
              <ul className="space-y-1 ml-4">
                <li>• Maintain professional appearance</li>
                <li>• Respect colleagues and clients</li>
                <li>• Confidentiality of client information</li>
                <li>• Punctual meeting attendance</li>
              </ul>
              
              <h4 className="font-medium mt-4">Prohibited:</h4>
              <ul className="space-y-1 ml-4">
                <li>• Personal use of company equipment</li>
                <li>• Disclosure of company secrets</li>
                <li>• Harassment of any kind</li>
                <li>• Unauthorized overtime</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Communication Policy */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-teal-600" />
              <CardTitle>Communication Guidelines</CardTitle>
            </div>
            <CardDescription>Internal and external communication standards</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-sm">Email Communication:</h4>
                <p className="text-sm text-muted-foreground">
                  Use company email for official communication. Personal emails not permitted.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-sm">Client Interaction:</h4>
                <p className="text-sm text-muted-foreground">
                  Always maintain professional tone. Escalate issues to supervisor when needed.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-sm">Social Media:</h4>
                <p className="text-sm text-muted-foreground">
                  No confidential company information to be shared on social platforms.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Procedures */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <CardTitle>Emergency Procedures</CardTitle>
            </div>
            <CardDescription>Safety and emergency contact information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-50 dark:bg-red-950/50 p-4 rounded-lg">
              <h4 className="font-medium text-red-800 dark:text-red-200">Emergency Contacts:</h4>
              <div className="text-sm text-red-700 dark:text-red-300 mt-2 space-y-1">
                <p>• Office Emergency: +91 9840281288</p>
                <p>• Fire Department: 101</p>
                <p>• Police: 100</p>
                <p>• Medical Emergency: 108</p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>In case of office emergency:</p>
              <ol className="list-decimal ml-4 mt-1 space-y-1">
                <li>Ensure personal safety first</li>
                <li>Alert colleagues and supervisor</li>
                <li>Call appropriate emergency services</li>
                <li>Follow evacuation procedures</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-teal-50 dark:bg-teal-950/50 p-6 rounded-lg">
        <h3 className="font-medium text-teal-800 dark:text-teal-200 mb-2">Important Note</h3>
        <p className="text-sm text-teal-700 dark:text-teal-300">
          All employees are required to acknowledge and abide by these rules and regulations. 
          Violations may result in disciplinary action. For any clarifications, contact HR department 
          or your immediate supervisor. These policies are subject to updates as per company requirements.
        </p>
      </div>
    </div>
  );
}