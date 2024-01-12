"use server"

import { db } from "@/lib/db";
import {InputType, ReturnType} from "./types"
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { CreateBoard } from "./schema";
import { createSafeAction } from "@/lib/create-safe-action";

const handler = async(data: InputType) : Promise<ReturnType> => {
    const {userId, orgId} = auth();

    if(!userId || !orgId) {
        return {
                error: "Unauthorized",
        }
    }
    const {title, image} = data;

    const [
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageUserName,
        imageLinkHTML
    ] = image.split("|")

    if(!imageId || !imageThumbUrl || !imageFullUrl || !imageUserName || !imageLinkHTML) {
        return {
            error: "Missing fields. Failed to create board.",
        }
    }

    let board;

    try {
        board = await db.board.create({
            data: {
                title,
                orgId,
                imageId,
                imageFullUrl,
                imageLinkHTML ,
                imageThumbUrl,
                imageUserName,
            }
        })
    } catch(error) {
        return {
            error: "Failed to create board",
        }
    }

    revalidatePath(`/board/${board.id}`)
    return {data: board}
}

export const createBoard = createSafeAction(CreateBoard, handler);