const Page = ({ params }: { params: { id: string } }) => {
    return (
        <div>
            Page ID Example {params.id}
        </div>
    )
}

export default Page;