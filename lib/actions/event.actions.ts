"use server";

import Event, { IEvent } from "@/database/event.model";
import connectDB from "@/lib/mongodb";

export const getSimilarEventsBySlug = async (
  slug: string
): Promise<IEvent[]> => {
  try {
    await connectDB();
    const event = await Event.findOne({ slug });

    const similarEvents = await Event.find({
      _id: { $ne: event._id },
      tags: { $in: event.tags },
    }).lean();
    return JSON.parse(JSON.stringify(similarEvents));
  } catch {
    return [];
  }
};

export const getAllEvents = async () => {
  try {
    console.log("Starting getAllEvents...");
    const mongooseInstance = await connectDB();
    console.log(
      `Connected to DB, state: ${mongooseInstance.connection.readyState}, fetching events...`
    );
    const events = await Event.find().sort({ createdAt: -1 }).maxTimeMS(5000);
    console.log(`Events fetched: ${events.length}`);

    return JSON.parse(JSON.stringify(events));
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const getEventBySlug = async (slug: string) => {
  try {
    await connectDB();
    const event = await Event.findOne({ slug });
    return JSON.parse(JSON.stringify(event));
  } catch (e) {
    console.error(e);
    return null;
  }
};
