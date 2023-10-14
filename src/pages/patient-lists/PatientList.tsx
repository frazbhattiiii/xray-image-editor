import { Link } from "react-router-dom";
import { Search, Trash2, Edit } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Patients } from "@/data/patients";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddPatientForm } from "@/components/common/add-patient-form";

const PatientList = () => {
  const [query, setQuery] = useState("");
  const [filteredPatients, setFilteredPatients] = useState(Patients);

  const handleSearch = () => {
    const filteredPatients = Patients.filter((patient) =>
      patient.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPatients(filteredPatients);
  };

  useEffect(() => {
    handleSearch();
  }, [query]);

  useEffect(() => {
    if (query === "") {
      setFilteredPatients(Patients);
    }
  }, [query]);

  return (
    <div>
      <Link to="/" className="flex justify-center items-center mt-10">
        <h1 className="text-4xl font-semibold">
          Xray {""}
          <span className="text-red-500">Editor</span>
        </h1>
      </Link>
      <div className="flex justify-between mt-10 mx-20">
        <h1 className="text-3xl font-bold">
          Welcome, {""}
          <span className=" text-gray-600">Ahmed</span>
        </h1>
        <Dialog>
          <DialogTrigger className="bg-red-500 hover:bg-red-600 rounded-md py-2 px-3 text-white text-md">
            Add Patient
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="mb-4">Add a new Patient</DialogTitle>
              <DialogDescription>
                <AddPatientForm/>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex flex-col items-center justify-center mt-14 mx-14 px-44 gap-14">
        <div className="flex">
          <input
            type="text"
            className="px-3 py-2 rounded-l-lg border border-gray-300 focus:outline-none focus:none w-full"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            className="bg-red-500 text-white px-3 py-[0.6rem] rounded-r-lg hover:bg-red-600 focus:outline-none"
            onClick={handleSearch}
          >
            <Search className="h-6 w-6" />
          </button>
        </div>

        <Table>
          <TableCaption>List of Patients</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Patient Name</TableHead>
              <TableHead className="w-[200px]">Edit</TableHead>
              <TableHead className="w-[200px]">Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell className="font-medium w-10/12">
                  {patient.name}
                </TableCell>
                <TableCell className="text-right w-11/12">
                  <Edit className="h-8 w-8 cursor-pointer bg-slate-200 text-red-500 p-2 rounded-md hover:text-red-600" />
                </TableCell>
                <TableCell className="text-right w-12/12">
                  <Trash2 className="h-8 w-8 cursor-pointer bg-slate-200 text-red-500 p-2 rounded-md hover:text-red-600" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PatientList;
