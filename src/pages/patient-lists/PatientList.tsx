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
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { AddPatientForm } from "@/components/common/add-patient-form";

type Patient = {
  id: string;   // Assuming the patient's ID is a string
  name: string; // Assuming the patient's name is a string
  // Add any other properties as necessary
};


const PatientList = () => {
  const [query, setQuery] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]); // Use the Patient type for the state
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const apiKey = import.meta.env.VITE_BASE_URL;

  const fetchPatients = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${apiKey}/patients/getPatients`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      const data = await response.data;
      console.log(response.data.data.Patients);
      setPatients(data.data.Patients);
      setFilteredPatients(data.data.Patients);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch patients initially and after adding a new patient
  useEffect(() => {
    fetchPatients();
  }, []);

  const handleSearch = () => {
    const filtered = patients.filter((patient) =>
      patient.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPatients(filtered);
  };

  useEffect(() => {
    handleSearch();
  }, [query, patients]);

  const deletePatient = async (patientId:string) => {
    console.log(patientId)
    try {
      const response = await axios.post(
        `${apiKey}/patients/deletePatients?patientId=${patientId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      if (response.status === 200) {
        console.log("Patient deleted successfully");

        // Refresh the patient list to reflect the deletion
        fetchPatients();
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (isLoading) return <div>Loading...</div>;
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
                <AddPatientForm onPatientAdded={fetchPatients} />
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex flex-col items-center justify-center mt-14 mx-10 px-20 gap-14">
        <div className="flex">
          <input
            type="text"
            className="px-3 py-2 rounded-l-lg border border-gray-300 focus:outline-none focus:none w-80"
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
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <Trash2
                        className="h-8 w-8 cursor-pointer bg-slate-200 text-red-500 p-2 rounded-md hover:text-red-600"
                       
                      />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the patient and remove your data from our
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction  onClick={() => deletePatient(patient.id)}>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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
