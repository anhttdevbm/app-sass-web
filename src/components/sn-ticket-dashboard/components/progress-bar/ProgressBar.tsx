import { memo } from "react"
import "./style.css"

interface ProgressBarProps {
    type: "priority" | "type" | "assign"
    data: any
}

const ProgressBar = (props: ProgressBarProps) => {

    const { type, data } = props

    const handleConvertPercent = (count: number, total: number) => {
        const percent = (count / total) * 100
        console.log("check percent" , percent)
        return `${percent}%`
    }

    const bgColor = (type: string) => {
        switch (type) {
            case "priority":
                return "rgba(255, 128, 77, 0.2)"
            case "type":
                return "linear-gradient(270deg, rgba(47, 234, 155, 0.2) 15.5%, rgba(127, 221, 83, 0.2) 85.5%)"
            case "assign":
                return "linear-gradient(143.13deg, rgba(54, 183, 255, 0.2) 5.36%, rgba(27, 89, 248, 0.2) 94.64%)"
            default:
        }
    }

    return (
        <>
            <div className="container-progress-bar">
                {Object.entries(data).map(([key, value]) => (
                    <div key={key} className="progress-bar">
                        <label className="text-lable">{key}</label>
                        <div style={{ display: "flex", alignItems: "center", gap: 3, marginTop: "12px" }}>
                            <div
                                className="progress-bar-item"
                                style={{
                                    background: bgColor(type)
                                }}
                            >
                                <div
                                    className="progress-bar-item-before"
                                    style={{
                                        background: "linear-gradient(143.13deg, #FFBF1A 5.36%, #FF4080 94.64%)",
                                        width : handleConvertPercent(value as number , 100)
                                    }}
                                >
                                </div>
                            </div>
                            <text className="text-count-ticket">{value as number}</text>
                        </div>

                    </div>
                ))}

            </div>
        </>
    )
}
export default memo(ProgressBar)