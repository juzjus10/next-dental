import jsPDF from "jspdf";
import "jspdf-autotable";

export function exportToPdf(tableName: string, name: string) {
    const doc = new jsPDF()
    doc.autoTable({ html: tableName })
    
  
    doc.save(`${name}.pdf`);
  }
  