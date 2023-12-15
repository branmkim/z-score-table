"use client"
import { useEffect, useState } from 'react'
import classNames from 'classnames'
import 'katex/dist/katex.min.css'
import Latex from 'react-latex-next'
import { rows, cols, values } from './constants'
import './page.css'
import Graph from './Graph'
import Equation from './Equation'

export default function Home() {
    const [focus, setFocus] = useState<[number, number]>([Math.ceil(values.length / 2) - 1, 0])
    const [mouseState, setMouseState] = useState<"none" | "hover" | "setting" | "set" | "releasing">("none")

    const [alpha, setAlpha] = useState<number>(0.00)
    const [zScore, setZScore] = useState<number>(0.00)


    useEffect(() => {
        setAlpha(parseFloat((rows[focus[0]] + Math.sign(focus[0] - Math.ceil(values.length / 2) - 0.5) * cols[focus[1]]).toFixed(2)))
        setZScore(values[focus[0]][focus[1]])
        console.log(focus, rows[focus[0]], cols[focus[1]])
    }, [focus])

    const handleZScoreChange = (zScore: number) => {
        let row = 0
        while (values[row][0] < zScore) {
            row += 1
        }
        row -= 1
        let best = 0
        let bestRow = 0
        let bestCol = 0
        console.log(row, values[row])
        if (values[row]) {
            values[row].forEach((v: number, i: number) => {
                if (Math.abs(v - zScore) < Math.abs(best - zScore)) {
                    best = v
                    bestRow = Math.trunc(i / 10) + row
                    bestCol = Math.round(i % 10)
                }
            })
        }
        if (values[row + 1]) {
            console.log(row + 1, values[row + 1])
            values[row + 1].forEach((v: number, i: number) => {
                if (Math.abs(v - zScore) < Math.abs(best - zScore)) {
                    best = v
                    bestRow = Math.trunc(i / 10) + row + 1
                    bestCol = Math.round(i % 10)
                }
            })
        }
        if (values[row - 1]) {
            console.log(row - 1, values[row - 1])
            values[row - 1].forEach((v: number, i: number) => {
                if (Math.abs(v - zScore) < Math.abs(best - zScore)) {
                    best = v
                    bestRow = Math.trunc(i / 10) + row - 1
                    bestCol = Math.round(i % 10)
                }
            })
        }
        console.log(best, bestRow, bestCol)
        setFocus([bestRow, bestCol])
    }

    return (
        <main className="flex flex-col justify-start items-start px-4">
            {/* <h1 className="text-xl">Z-Score Table</h1>
            <p>explanation of what a z-score is</p> */}
            <div className="flex flex-col md:flex-row justify-center items-start">
                <div className="z-graph sticky top-0 flex flex-col items-start justify-start md:w-1/3 w-full h-1/3 z-40 pt-4 md:pt-16 mr-8">
                    <Graph alpha={alpha}/>
                    <Equation alpha={alpha} zScore={zScore}
                        color={"red"}
                        onAlphaChange={(alpha : string) => { // string bc of -0 case
                            if (["-0", "-0.", "-0.0", "-0.00"].includes(alpha)) {
                                setFocus([40, Math.round(Math.abs(parseFloat(alpha)*100%10))])
                            }
                            setFocus([rows.indexOf(Math.trunc(parseFloat(alpha)*10)/10), Math.round(Math.abs(parseFloat(alpha)*100%10))])
                        }}
                        onZScoreChange={(zScore : number) => {
                            handleZScoreChange(zScore)
                        }}
                    />
                    <Equation alpha={alpha} zScore={ parseFloat((zScore < 0.5 ? 0.5 - zScore : 1 - zScore).toFixed(4)) }
                        color={"blue"}
                        onAlphaChange={(alpha : string) => { // string bc of -0 case
                            if (["-0", "-0.", "-0.0", "-0.00"].includes(alpha)) {
                                setFocus([40, Math.round(Math.abs(parseFloat(alpha)*100%10))])
                            }
                            setFocus([rows.indexOf(Math.trunc(parseFloat(alpha)*10)/10), Math.round(Math.abs(parseFloat(alpha)*100%10))])
                        }}
                        onZScoreChange={(zScore : number) => {
                            if (zScore < 0.5) {
                                handleZScoreChange(0.5 - zScore)
                            } else {
                                handleZScoreChange(1 - zScore)
                            }
                        }}
                    />
                </div>

                <div className="z-table flex flex-col">
                    <div className="bg-white z-20 sticky md:top-0 w-full h-4"></div>
                    {/* col headers */}
                    <div className="flex flex-row z-20 sticky top-4">
                        <div className="bg-white w-16"></div>
                        { cols.map((c, ci) => {
                            return <Cell pos={[-1, ci]} value={cols[ci]} rowIndex={-1}
                            hsl={[0, 0, 90]}
                            type="col" 
                            focus={focus} setFocus={setFocus}
                            mouseState={mouseState} setMouseState={setMouseState}
                            key={`${-1}-${ci}`}
                            />
                        })}
                    </div>

                    { rows.map((r, ri) => {
                        return (
                            // row headers
                            <div className={`flex flex-row ${mouseState != "none" && focus[0] == ri ? "sticky z-30 top-12" : null}`} key={`${ri}--1`}>
                                <Cell pos={[ri, -1]} value={rows[ri]} rowIndex={ri}
                                    hsl={[0, 0, 90]}
                                    type="row" 
                                    focus={focus} setFocus={setFocus}
                                    mouseState={mouseState} setMouseState={setMouseState}
                                    key={`${ri}-${-1}`}
                                />

                                {/* values */}
                                { cols.map((c, ci) => {
                                    return <Cell pos={[ri, ci]} value={values[ri][ci]} rowIndex={ri}
                                        hsl={[50 + (ri * 10), 40, 70 - (ci * 2)]}
                                        type="cell" 
                                        focus={focus} setFocus={setFocus}
                                        mouseState={mouseState} setMouseState={setMouseState}
                                        key={`${ri}-${ci}`}
                                    />
                                })}
                            </div>
                        )
                    })}
                </div>
            </div>
        </main>
    )
}

interface CellProps {
    pos: [number, number]
    value: number
    rowIndex: number
    hsl: [number, number, number]
    type: "cell" | "row" | "col"
    focus: [number | undefined, number | undefined]
    setFocus: Function
    mouseState: "none" | "hover" | "setting" | "set" | "releasing"
    setMouseState: Function
}
function Cell({ pos, value, rowIndex, hsl, type, focus, setFocus, mouseState, setMouseState }: CellProps) {
    const [focused, setFocused] = useState<boolean>(false)

    let alt = rowIndex % 10 < 5

    useEffect(() => {
        if (mouseState != "none") {
            if (type == "cell") {
                setFocused(focus[0] == pos[0] && focus[1] == pos[1])
            } else if (type == "row") {
                setFocused(focus[0] == pos[0])
            } else if (type == "col") {
                setFocused(focus[1] == pos[1])
            }
        } else {
            setFocused(false)
        }
    }, [focus, mouseState])

    return (
        <div className={`flex`}
            onMouseEnter={() => {
                if (mouseState != "set") {
                    if (type == "cell") {
                        setMouseState("hover")
                        setFocus([...pos])
                    }
                }
            }}
            onMouseLeave={() => {
                if (mouseState != "set") {
                    setMouseState("none")
                }
            }}
            onMouseDown={() => {
                if (type == "cell") {
                    if (mouseState == "hover") setMouseState("setting")
                    else setMouseState("releasing")
                }
            }}
            onMouseUp={() => { 
                if (mouseState == "setting") setMouseState("set")
                else {
                    setMouseState("none")
                } 
            }}
        >
            <div className={classNames(`cell-content flex w-16 h-8 text-sm justify-center items-center mouse-${mouseState}`, {
                'z-30 focused': mouseState != "none" && focused,
                'z-0': !focused,
                // colors
                'bg-zinc-100': alt && type == "cell" && !focused,
                'bg-zinc-300': !alt && type == "cell" && !focused,
                'bg-zinc-600': alt && type != "cell" && !focused,
                'bg-zinc-700': !alt && type != "cell" && !focused,
                'bg-white': (alt && type == "cell" && focused)
                        || (!alt && type == "cell" && focused)
                        || (alt && type != "cell" && focused)
                        || (!alt && type != "cell" && focused),
                'text-zinc-200': !focused && (type == "row" || type == "col"),
                // borders
                'border-black': true,
                'border-2': focused,
                'border-t-2 border-b-2': !focused && mouseState != "none" && (focus[0] == pos[0]),
                'border-r-2': !focused && mouseState != "none" && (focus[0] == pos[0]) && (pos[1] == values[0].length - 1),
                'border-l-2 border-r-2': !focused && mouseState != "none" && (focus[1] == pos[1]),
                'border-b-2': !focused && mouseState != "none" && (focus[1] == pos[1]) && (pos[1] == values.length - 1),
            })}>
                <p className={`${type == "col" || type == "row" ? "font-bold" : ""}`}>{ 
                    type == "row" && rowIndex == Math.ceil(values.length / 2) - 1 ? "-0.0" :
                    type == "row" && rowIndex == Math.ceil(values.length / 2) ? "0.0" :
                    type == "cell" ? value.toFixed(4) : 
                    type == "col" ? value.toFixed(2) : 
                    type == "row" ? value.toFixed(1) : null
                }</p>
            </div>
            <div className={`relative -ml-16 -z-10 w-16 h-8 bg-black`}></div>
        </div>
    )
}