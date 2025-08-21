import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="p-6">
      <Card className="max-w-2xl mx-auto mt-12">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Construction className="w-8 h-8 text-gray-400" />
          </div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          {description && (
            <p className="text-gray-600">{description}</p>
          )}
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-500 mb-4">
            This section is under development and will be available soon.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              Features planned for this section:
            </p>
            <ul className="text-sm text-gray-500 mt-2 space-y-1">
              <li>• Data management interface</li>
              <li>• CRUD operations</li>
              <li>• Search and filtering</li>
              <li>• Export functionality</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}