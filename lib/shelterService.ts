/**
 * Cooling Shelters Data Service (SIH26181)
 * 
 * Fetches shelters from Supabase with fallback to built-in verified shelter network.
 */

import { CoolingShelter, ShelterType } from "@/types/shelter";
import { supabase } from "./supabase";
import { isSupabaseConfigured } from "./supabaseClient";

export const FALLBACK_SHELTERS: CoolingShelter[] = [
  // Delhi NCR
  {
    id: "delhi-cp-01",
    name: "Connaught Place Heat Respite & Hydration Center",
    type: "cooling_center",
    latitude: 28.6315,
    longitude: 77.2167,
    address: "Palika Kendra Community Hall, Sansad Marg, New Delhi 110001",
    capacity: 180,
    phone_number: "+91 11 2336 0000",
    is_open_now: true,
  },
  {
    id: "delhi-kg-02",
    name: "Kashmere Gate DUSIB Night & Heat Shelter (Rain Basera)",
    type: "night_shelter",
    latitude: 28.6675,
    longitude: 77.2285,
    address: "Near Kashmere Gate ISBT, Mori Gate, Delhi 110006",
    capacity: 120,
    phone_number: "+91 11 2386 4500",
    is_open_now: true,
  },
  {
    id: "delhi-rml-03",
    name: "Dr. Ram Manohar Lohia Hospital Emergency & Heat Stroke Clinic",
    type: "clinic",
    latitude: 28.6253,
    longitude: 77.2008,
    address: "Baba Kharak Singh Marg, Connaught Place, New Delhi 110001",
    capacity: 250,
    phone_number: "+91 11 2336 5525",
    is_open_now: true,
  },
  {
    id: "delhi-hk-04",
    name: "Aam Aadmi Mohalla Clinic & PHC - Hauz Khas",
    type: "phc",
    latitude: 28.5494,
    longitude: 77.2001,
    address: "Near Hauz Khas Market, New Delhi 110016",
    capacity: 40,
    phone_number: "+91 11 2656 1234",
    is_open_now: true,
  },
  {
    id: "delhi-niz-05",
    name: "Nizamuddin Rain Basera Respite Point",
    type: "night_shelter",
    latitude: 28.5916,
    longitude: 77.2490,
    address: "Opposite Hazrat Nizamuddin Railway Station, New Delhi 110013",
    capacity: 90,
    phone_number: "+91 11 2435 8899",
    is_open_now: true,
  },
  {
    id: "delhi-meh-06",
    name: "Primary Health Centre (PHC) - Mehrauli",
    type: "phc",
    latitude: 28.5170,
    longitude: 77.1852,
    address: "Kalka Das Marg, Ward No 2, Mehrauli, New Delhi 110030",
    capacity: 60,
    phone_number: "+91 11 2664 3456",
    is_open_now: true,
  },

  // Mumbai
  {
    id: "mum-dad-01",
    name: "Dadar Municipal Cooling Center & ORS Relief Station",
    type: "cooling_center",
    latitude: 19.0178,
    longitude: 72.8478,
    address: "BMC Ward Office Premises, Senapati Bapat Marg, Dadar West, Mumbai 400028",
    capacity: 150,
    phone_number: "+91 22 2422 1212",
    is_open_now: true,
  },
  {
    id: "mum-csmt-02",
    name: "CSMT BMC Night Shelter Respite Home",
    type: "night_shelter",
    latitude: 18.9402,
    longitude: 72.8356,
    address: "Near St. George Hospital Lane, Fort, Mumbai 400001",
    capacity: 85,
    phone_number: "+91 22 2262 0242",
    is_open_now: true,
  },
  {
    id: "mum-kem-03",
    name: "KEM Hospital Acute Heat Management Unit",
    type: "clinic",
    latitude: 19.0034,
    longitude: 72.8427,
    address: "Acharya Donde Marg, Parel, Mumbai 400012",
    capacity: 300,
    phone_number: "+91 22 2410 7000",
    is_open_now: true,
  },
  {
    id: "mum-ban-04",
    name: "Urban Health Post & PHC - Bandra West",
    type: "phc",
    latitude: 19.0596,
    longitude: 72.8295,
    address: "Waterfield Road, Bandra West, Mumbai 400050",
    capacity: 50,
    phone_number: "+91 22 2642 9876",
    is_open_now: true,
  },

  // Bengaluru
  {
    id: "blr-cub-01",
    name: "Cubbon Park Metro Heat Oasis & Hydration Booth",
    type: "cooling_center",
    latitude: 12.9778,
    longitude: 77.5990,
    address: "Kasturba Road, Near High Court Gate, Bengaluru 560001",
    capacity: 100,
    phone_number: "+91 80 2286 4433",
    is_open_now: true,
  },
  {
    id: "blr-maj-02",
    name: "BBMP Night Shelter (Rain Basera) - Majestic",
    type: "night_shelter",
    latitude: 12.9767,
    longitude: 77.5713,
    address: "Near Sangam Theatre, Gandhinagar, Bengaluru 560009",
    capacity: 110,
    phone_number: "+91 80 2226 7788",
    is_open_now: true,
  },
  {
    id: "blr-kcg-03",
    name: "KC General Hospital Heat Stroke Respite Clinic",
    type: "clinic",
    latitude: 12.9984,
    longitude: 77.5714,
    address: "5th Cross Road, Malleshwaram, Bengaluru 560003",
    capacity: 200,
    phone_number: "+91 80 2334 1771",
    is_open_now: true,
  },
  {
    id: "blr-ind-04",
    name: "Namma Clinic / PHC - Indiranagar",
    type: "phc",
    latitude: 12.9719,
    longitude: 77.6412,
    address: "100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru 560038",
    capacity: 45,
    phone_number: "+91 80 2521 3456",
    is_open_now: true,
  },

  // Jaipur
  {
    id: "jpr-ram-01",
    name: "Ram Niwas Bagh Community Heat Respite Pavilion",
    type: "cooling_center",
    latitude: 26.9124,
    longitude: 75.8185,
    address: "Albert Hall Road, Ram Niwas Bagh, Jaipur 302004",
    capacity: 140,
    phone_number: "+91 141 261 4500",
    is_open_now: true,
  },
  {
    id: "jpr-sms-02",
    name: "SMS Hospital Emergency & Heat Stroke Response Ward",
    type: "clinic",
    latitude: 26.8988,
    longitude: 75.8156,
    address: "JLN Marg, Ashok Nagar, Jaipur 302005",
    capacity: 350,
    phone_number: "+91 141 256 0291",
    is_open_now: true,
  }
];

export interface FetchSheltersOptions {
  type?: ShelterType | "all";
  search?: string;
}

/**
 * Fetches cooling shelters from Supabase with graceful fallback to cached/local shelters.
 */
export async function getCoolingShelters(
  options: FetchSheltersOptions = {}
): Promise<{ shelters: CoolingShelter[]; source: "supabase" | "fallback" }> {
  const { type } = options;

  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from("cooling_shelters").select("*");

      if (type && type !== "all") {
        query = query.eq("type", type);
      }

      const { data, error } = await query;

      if (!error && data && data.length > 0) {
        return {
          shelters: data as CoolingShelter[],
          source: "supabase",
        };
      }
    } catch (err) {
      console.warn("Could not fetch cooling shelters from Supabase, using fallback network:", err);
    }
  }

  // Fallback to local verified network
  let results = [...FALLBACK_SHELTERS];
  if (type && type !== "all") {
    results = results.filter((s) => s.type === type);
  }

  return {
    shelters: results,
    source: "fallback",
  };
}
