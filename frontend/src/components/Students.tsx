import { useEffect, useState } from "react";

type Student = {
    id: number;
    prn_no: number;
    name: string;
    program: string;
};

export function Students() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // first fetch the student's data from API 
    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const res = await fetch("http://localhost:3000/");

                if (!res.ok) {
                    throw new Error("Failed to fetch students");
                }

                const data: { students?: Student[] } = await res.json();
                setStudents(data.students ?? []);
            } catch (error) {
                setError(error instanceof Error ? error.message : "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchStudentData();
    }, [])

    if (loading) {
        return <p>Loading students...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h2>Students</h2>
            <ul>
                {students.map((student: Student) => (
                    <li key={student.id}>
                        {student.name} - {student.prn_no} - {student.program}
                    </li>
                ))}
            </ul>
        </div>
    );
}