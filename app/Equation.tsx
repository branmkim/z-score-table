import { useState, useEffect, useRef } from "react";
import { rows, cols, values } from './constants'

interface EquationProps {
    color: string
    alpha: number
    zScore: number
    onAlphaChange: (alpha: string) => void
    onZScoreChange: Function
}
export default function Equation({ color, alpha, zScore, onAlphaChange, onZScoreChange }: EquationProps) {
    const [alphaStr, setAlphaStr] = useState(alpha.toString())
    const [zScoreStr, setZScoreStr] = useState(zScore.toString())

    const zScoreRef = useRef(null)

    useEffect(() => {
        setAlphaStr(alpha.toString())
    }, [alpha])

    useEffect(() => {
        // while (document.activeElement == zScoreRef.current) {}
        if (document.activeElement != zScoreRef.current) {
            setZScoreStr(zScore.toString())
        }
    }, [zScore])

    const onBlur = () => {
        console.log("onBlur")
        setZScoreStr(zScore.toString())
    }

    return (
        <div className="flex items-start justify-start pt-2 pb-4" style={{
            fontFamily: "computer modern",
            color: color == "red" ? "#d35f5f" : "#37abc8"
        }}>
            <p className="text-3xl">{ color == "red" ? "z" : 
                alpha < 0 ? "0.5 - z" : "1 - z" 
            }</p>
            <input className="relative text-2xl top-4 w-16 mx-2 pl-1 text-left bg-gray-100 rounded-md border-2 border-gray-300" 
                type="text"
                value={alphaStr}
                onChange={(e) => {
                    let val = (e.target as HTMLInputElement).value
                    if (val == "" || /^\-?\d?(\.\d{0,2})?$/.test(val)) {
                        setAlphaStr(val)
                        if (parseFloat(val) <= 3.49 && parseFloat(val) >= -3.49) {
                            onAlphaChange(val)
                        }
                    }
                }}
                />
            <p className="text-3xl">=</p>
            <input className="relative text-3xl h-full w-28 mx-2 pl-1 text-left bg-gray-100 rounded-md border-2 border-gray-300" 
                type="text"
                value={zScoreStr}
                ref={zScoreRef}
                onBlur={onBlur}
                onChange={(e) => {
                    let val = (e.target as HTMLInputElement).value
                    if (val == "" || /^0?(\.\d{0,5})?$/.test(val)) {
                        setZScoreStr(val)
                        if (parseFloat(val) <= 3.49 && parseFloat(val) >= -3.49) {
                            onZScoreChange(val)
                        }
                    }
                }}
            />
        </div>
    );
}