import { NextRequest, NextResponse } from "next/server";
import { getCoolingShelters } from "@/lib/shelterService";
import { ShelterType } from "@/types/shelter";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const typeParam = searchParams.get("type") as ShelterType | "all" | null;
    const searchParam = searchParams.get("search") || undefined;

    const validTypes: (ShelterType | "all")[] = ["cooling_center", "night_shelter", "clinic", "phc", "all"];
    const type = typeParam && validTypes.includes(typeParam) ? typeParam : "all";

    const { shelters, source } = await getCoolingShelters({
      type,
      search: searchParam,
    });

    return NextResponse.json({
      success: true,
      count: shelters.length,
      source,
      shelters,
    });
  } catch (error) {
    console.error("API error in /api/shelters:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve cooling shelters",
      },
      { status: 500 }
    );
  }
}
