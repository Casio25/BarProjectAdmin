import {cn} from "@nextui-org/react";
interface PasswordProps {
    strength: 0 | 1 | 2 | 3;
}

export const PasswordStrengthBar = ({strength}: PasswordProps) => {
    return(
        <div className="flex gap-2">
            {Array.from({length: strength + 1}).map((i, index) => (
                <div key={index}
                className={cn('h-2 w-8 rounded-md', {
                    'bg-red-500': strength === 0,
                    'bg-orange-500': strength === 1,
                    'bg-yellow-500': strength === 2,
                    'bg-green-500': strength === 3,
                })}>
                </div>
            ))}
        </div>
    )
}