import 'katex/dist/katex.min.css'

interface GraphProps {
    alpha: number
}
export default function Graph({ alpha }: GraphProps) {
    return (
        <>
        <div className="flex flex-col items-start justify-start">
            <div className="relative flex flex-col items-center justify-center object-contain">
                <img src="/normal_graph.svg" className="z-20" />
                <img src="/red_fill.svg" className={`z-10 dynamic-width absolute bottom-0 left-0 h-full object-cover object-left`}
                    style={{
                        width: 50 + ((50 / 3.5) * alpha) + "%",
                    }}
                />
                <img src="/blue_fill.svg" className={`dynamic-width absolute bottom-0 left-0 h-full object-cover object-left`}
                    style={{
                        width: alpha < 0 ? "50%" : "100%",
                    }}
                />
                <div className="dynamic-width z-30 absolute top-0 left-0"
                    style={{
                        height: "calc(100% + 0.5rem)",
                        marginLeft: "0.075rem",
                        borderRight: "0.15rem dashed black",
                        width: 50 + ((50 / 3.5) * alpha) + "%",
                        filter: `hue-rotate(${45 * alpha}deg)`
                    }}
                    />
            </div>
            <div className="dynamic-width dynamic-margin" style={{
                marginTop: "0.5rem",
                marginLeft: 50 + ((50 / 3.5) * alpha) + "%",
                transform: "translate(-50%, 0)"
            }}>
                <p style={{
                    fontFamily: "computer modern",
                }}>
                    { alpha }
                </p>
            </div>
        </div>
        </>
    )
}