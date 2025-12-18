"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SalonAPI } from "@/lib/services";
import { ApiError } from "@/lib/utils/apiClient";
import type { Salon, UpdateSalonData, SalonHours } from "@/lib/types/api";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Save } from "lucide-react";

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export default function EditSalonPage() {
  const router = useRouter();
  const params = useParams();
  const salonId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [salon, setSalon] = useState<Salon | null>(null);

  const [formData, setFormData] = useState<UpdateSalonData>({
    name: "",
    address: "",
    phone: "",
    venueType: "everyone",
  });

  const [hours, setHours] = useState<SalonHours>({});
  const [geo, setGeo] = useState({
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    fetchSalon();
  }, [salonId]);

  const fetchSalon = async () => {
    try {
      setLoading(true);
      const response = await SalonAPI.getSalonById(salonId);
      const salonData = response.data;
      setSalon(salonData);

      // Populate form
      setFormData({
        name: salonData.name,
        address: salonData.address,
        phone: salonData.phone || "",
        venueType: salonData.venueType,
      });

      if (salonData.geo) {
        setGeo({
          latitude: salonData.geo.latitude.toString(),
          longitude: salonData.geo.longitude.toString(),
        });
      }

      if (salonData.hours) {
        setHours(salonData.hours);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("Failed to load salon data");
      }
      router.push("/dashboard/salons");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGeoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGeo((prev) => ({ ...prev, [name]: value }));
  };

  const handleHoursChange = (
    day: (typeof DAYS)[number],
    field: "open" | "close",
    value: string
  ) => {
    setHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updateData: UpdateSalonData = {
        ...formData,
      };

      // Add geo if provided
      if (geo.latitude && geo.longitude) {
        updateData.geo = {
          latitude: parseFloat(geo.latitude),
          longitude: parseFloat(geo.longitude),
        };
      }

      // Add hours if any are set
      const hasHours = Object.keys(hours).length > 0;
      if (hasHours) {
        updateData.hours = hours;
      }

      await SalonAPI.updateSalon(salonId, updateData);
      toast.success("Salon updated successfully");
      router.push("/dashboard/salons");
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("Failed to update salon");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading salon data...</p>
        </div>
      </div>
    );
  }

  if (!salon) {
    return null;
  }

  return (
    <div className="space-y-6 p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push("/dashboard/salons")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Salon</h1>
          <p className="text-muted-foreground mt-1">
            Update salon information and settings
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Salon Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter salon name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                placeholder="Enter full address"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="9876543210"
                  maxLength={10}
                  pattern="[6-9][0-9]{9}"
                />
                <p className="text-xs text-muted-foreground">
                  10-digit Indian mobile number
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="venueType">Venue Type</Label>
                <Select
                  value={formData.venueType}
                  onValueChange={(value: any) =>
                    setFormData((prev) => ({ ...prev, venueType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select venue type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="everyone">Everyone</SelectItem>
                    <SelectItem value="male">Male Only</SelectItem>
                    <SelectItem value="female">Female Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Coordinates */}
        <Card>
          <CardHeader>
            <CardTitle>Location Coordinates (Optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  name="latitude"
                  type="number"
                  step="any"
                  value={geo.latitude}
                  onChange={handleGeoChange}
                  placeholder="19.0760"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  name="longitude"
                  type="number"
                  step="any"
                  value={geo.longitude}
                  onChange={handleGeoChange}
                  placeholder="72.8777"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Hours */}
        <Card>
          <CardHeader>
            <CardTitle>Business Hours (Optional)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {DAYS.map((day) => (
              <div key={day} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <Label className="capitalize">{day}</Label>
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`${day}-open`} className="text-xs">
                    Opening Time
                  </Label>
                  <Input
                    id={`${day}-open`}
                    type="time"
                    value={hours[day]?.open || ""}
                    onChange={(e) =>
                      handleHoursChange(day, "open", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`${day}-close`} className="text-xs">
                    Closing Time
                  </Label>
                  <Input
                    id={`${day}-close`}
                    type="time"
                    value={hours[day]?.close || ""}
                    onChange={(e) =>
                      handleHoursChange(day, "close", e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/salons")}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
