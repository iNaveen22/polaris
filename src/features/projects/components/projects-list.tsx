import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Spinner } from "@/components/ui/spinner";
import { useProjectsPartial } from "../hooks/use-projects";
import { GlobeIcon } from "lucide-react";
import { Kbd } from "@/components/ui/kbd";

import { Doc } from "../../../../convex/_generated/dataModel"
import { FaGithub } from "react-icons/fa";

const formatTimestamp = (timestamp: number) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
};

const getProjectIcon = (project: Doc<"projects">) => {
    if(project.importStatus === "completed") {
        return <FaGithub />
    }
}

interface ProjectsListProps {
    onViewAll: () => void;
}

const ProjectItem = ({ data }: {
    data: Doc<"projects">
}) => {
    return (
        <Link href={`/projects/${data._id}`}
            className="text-sm text-foreground/60 font-medium hover:text-foreground py-1 flex items-center justify-between w-full group"
        >
            <div className="flex items-center gap-2">
                <GlobeIcon />
                <span className="truncate">{data.name}</span>
            </div>
            <span
                className="text-xs text-muted-foreground group-hover:text-foreground/60 transition-colors"
            >
                {formatTimestamp(data.updatedAt)}
            </span>
        </Link>
    );
}

export const ProjectsList = ({
    onViewAll
}: ProjectsListProps) => {
    const projects = useProjectsPartial(6);

    if (projects === undefined) {
        return <Spinner className="size-4 text-ring" />
    }


    return (
        <div className="flex flex-col gap-4">
            {projects.length > 0 && (
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-muted-foreground">
                            Recent projects
                        </span>
                        <button
                            className="flex items-center gap-2 text-muted-foreground text-xs hover:text-foreground transition-colors"
                        >
                            <span>View all</span>
                            <Kbd className="bg-accent border">
                                ctr+k
                            </Kbd>
                        </button>
                    </div>
                    <ul className="flex flex-col">
                        {projects.map((project) => (
                            <ProjectItem
                                key={project._id}
                                data={project}
                            />
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}