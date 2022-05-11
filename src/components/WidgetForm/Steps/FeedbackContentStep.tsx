import { ArrowLeft} from "phosphor-react";
import { FormEvent, useState } from "react";
import { FeedbackType, feedbackTypes } from "..";
import { api } from "../../../lib/api";
import { CloseButton } from "../../CloseButton";
import { Loading } from "../../Loading";
import { ScreenshotButton } from "../ScreenshotButton";

type Props = {
    onClickButton: React.MouseEventHandler<HTMLButtonElement>;
    feedbackType: FeedbackType;
    onFeedbackRestarRequest: () => void;
    onFeedbackSent: () => void;
}

export function FeedbackContentStep ({ 
    onClickButton, 
    feedbackType, 
    onFeedbackRestarRequest,
    onFeedbackSent
 } : Props){


    const [screenshot, setScreenshot] = useState<string | null> (null)
    const [comment, setComment] = useState('')
    const [isSendingFeedback, setIsSendingFeedback] = useState(false)


    const feedbackTypeInfo = feedbackTypes[feedbackType]

    async function handleSubmitFeedback (event: FormEvent) {
       event.preventDefault()

       setIsSendingFeedback(true)

       await api.post('/create-feedback',{
           type: feedbackType,
           comment,
           screenshot,
       })

       setIsSendingFeedback(false)

       onFeedbackSent()
    }
   
    return (
        <>
            <header>
                <button
                    type="button"
                    className="top-5 left-5 absolute text-zinc-400 hover:text-zinc-100"
                    onClick={onFeedbackRestarRequest}
                >
                        <ArrowLeft
                            weight="bold" 
                            className="w-4 h4"
                    />
                </button>
                <span className="text-xl leading-6 flex items-center gap-2">
                    <img 
                        src={feedbackTypeInfo.image.source}
                        alt={feedbackTypeInfo.image.alt}  
                        className='w-6 h-6'
                    />
                    {feedbackTypeInfo.title}
                </span>
                <CloseButton onClickButton={onClickButton} />     
            </header>   
            <form
                onSubmit={handleSubmitFeedback} 
                className="my-4 w-full">
                <textarea 
                className="min-w-[304px] w-full min-h-[112px] text-sm placeholder-zinc-400 text-zinc-100 border-zinc-600 bg-transparent rounded-md focus:border-[#8257e6] focus:ring-[#8257e6] focus:ring-1 resize-none focus:outline-none scrollbar scrollbar-thumb-zinc-700 scrollbar-track-transparent scrollbar-thin"
                placeholder="Conte com detalhes o que está acontecendo..."
                onChange={event => setComment(event.target.value)}
                />

                <footer className="flex gap-2 mt-2">
                    <ScreenshotButton
                        screenshot={screenshot}
                        onScreenshotTook={setScreenshot}
                    />
                    <button
                    type="submit"
                    disabled={comment.length === 0 || isSendingFeedback}
                    className="p-2 bg-[#8257e6] rounded-md border-transparent flex-1 flex justify-center items-center text-sm hover:bg-[#996DFF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-[#8257e6] transition-colors disabled:opacity-50 disabled:hover:bg-[#8257e6]">
                        {isSendingFeedback? <Loading /> : 'Enviar Feedback'}
                    </button>
                </footer>
            </form>
       </>
    )
}