import { useState } from "react";

export default function Equation() {
    const [alpha, setAlpha] = useState("")

    return (
        <div className="flex items-start justify-start bg-emerald-300">
            <p className="text-4xl">z</p>
            <input className="relative text-2xl top-4 w-16 text-center" 
                type="text"
                value={alpha}
                onChange={(e) => {
                    console.log((e.target as HTMLInputElement).value.match(/\-?[0-9]*\.?[0-9]*/g))
                    const regexCheck = (e.target as HTMLInputElement).value.match(/\-?[0-9]*\.?[0-9]*/g)?.reduce(
                        (acc, curr) => {
                            return acc || curr.length > 0
                        }, false
                    )
                    if (regexCheck && (e.target as HTMLInputElement).value.match(/\-?[0-9]*\.?[0-9]*/g)) {
                        setAlpha((e.target as HTMLInputElement).value)
                    }
                }}
            />
            <p className="text-4xl">=</p>
        </div>
    );
}