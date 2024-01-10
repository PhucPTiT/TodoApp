"use client"

import { createBoard } from "@/actions/create-board";
import { FormSubmit } from "@/components/form/form-button";
import { FormInput } from "@/components/form/form-input";
import { Button } from "@/components/ui/button"
import { useAction } from "@/hooks/use-action";

export const Form = () => {
    const {execute, fieldErrors} = useAction(createBoard, {
        onSuccess: (data) => {
            console.log(data, "SUCCESS");
        },
        onError: (error) => {
            console.error(error);
        }
    })
    const onSubmit=(formData: FormData) => {
        const title = formData.get("title") as string;
        execute({title});
    }
    return (
        <form action = {onSubmit}>
            <div className="flex flex-col space-y-2">
                <FormInput
                    label = "Board Title"
                    id  = "title"
                    errors = {fieldErrors}
                />
            </div>
            <FormSubmit>
                Save
            </FormSubmit>
        </form>
    )
}