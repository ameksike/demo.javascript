interface LayoutParam {
    children: React.ReactNode
}

export default function ({ children }: LayoutParam) {
    return (
        <div className="h-full flex items-center justify-center">
            {children}
        </div>
    );
}