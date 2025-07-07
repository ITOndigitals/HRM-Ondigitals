<?php

namespace App\Http\Controllers\Projects;

use App\Http\Controllers\Controller;
use App\Models\ProjectDocument;
use App\Models\ProjectDocumentPaymentPeriod;
use Carbon\Carbon;
use Date;
use Illuminate\Http\Request;

use function PHPSTORM_META\map;

class ProjectDocumentController extends Controller
{
    //
    public function createNewDocument(Request $request)
    {
        $newDocument = ProjectDocument::create([
            'project_id' => $request->projectId,
            'contract_link' => $request->contractLink
        ]);
        // xử lý tháng 
        // nếu tháng hiện tại lớn hơn => năm trước
        // nếu tháng hiện tại nhỏ hơn => năm nay
        if ($request->terms) {
            $documentTerms = $request->terms;
            foreach ($documentTerms as $term) {
                $currentTime = now()->year($term['year']);
                $monthDate = Carbon::createFromDate($term['year'], $term['month'], 1);
                $newDocumentTerm = ProjectDocumentPaymentPeriod::create([
                    // 'month' => $currentTime->month($term['month']), // temporary now
                    'month' => $monthDate,
                    'project_documents_id' => $newDocument['id'],
                    'invoice_link' => $term['invoice_link'],
                    'red_invoice_link' => $term['red_invoice_link'],
                    'acceptance_link' => $term['acceptance_link'],
                    'report_link' => $term['report_link'],
                    'has_sent' => $term['has_sent'],
                    'has_paid' => $term['has_paid']
                ]);
            }
        }
        return response()->json(['message' => "Đã thêm giấy tờ thành công"]);
    }
    public function updateDocument(Request $request)
    {
        // $newDocument = ProjectDocument::create(attributes: [
        //     'contract_link' => $request->contractLink
        // ]);
        $curDocument = ProjectDocument::find($request->documentId);
        if ($curDocument) {
            $curDocument->update(['contract_link' => $request->contractLink]);
        }
        // 
        $updatedTerms = $request->terms;
        foreach ($updatedTerms as $term) {
            // nếu payment period đã tồn tại
            if (isset($term['id']) && $term['id']) {
                // $currentTime = now()->year(2025);
                $monthDate = Carbon::createFromDate($term['year'], $term['month'], 1);
                $paymentPeriod = ProjectDocumentPaymentPeriod::find($term['id']);
                $paymentPeriod->update([
                    'month' => $monthDate, // temporary now
                    'invoice_link' => $term['invoice_link'],
                    'red_invoice_link' => $term['red_invoice_link'],
                    'acceptance_link' => $term['acceptance_link'],
                    'report_link' => $term['report_link'],
                    'has_sent' => $term['has_sent'],
                    'has_paid' => $term['has_paid']
                ]);
            } else {
                // nếu payment không tồn tại thì tạo mới 
                $monthDate = Carbon::createFromDate($term['year'], $term['month'], 1);
                $newDocumentTerm = ProjectDocumentPaymentPeriod::create([
                    'month' => $monthDate, // temporary now
                    'project_documents_id' => $curDocument['id'], // temporary
                    'invoice_link' => $term['invoice_link'],
                    'red_invoice_link' => $term['red_invoice_link'],
                    'acceptance_link' => $term['acceptance_link'],
                    'report_link' => $term['report_link'],
                    'has_sent' => $term['has_sent'],
                    'has_paid' => $term['has_paid']
                ]);
            }
        }
        return response()->json(['message' => "Cập nhật thành công", 'newTerms' => $curDocument->projectDocumentPaymentPeriod]);
    }
    public function getProjectDocument(Request $request, $id)
    {
        $projectDocument = ProjectDocument::where("project_id", $id)
            ->with('projectDocumentPaymentPeriod') // eager-load the relationship
            ->first();
        // đổi từ date sang tháng và năm (int)
        if ($projectDocument && $projectDocument->projectDocumentPaymentPeriod) {
            foreach ($projectDocument->projectDocumentPaymentPeriod as $period) {
                if ($period->month) {
                    $date = Carbon::parse($period->month);
                    $period->year = $date->year;
                    $period->month = $date->month; // or 'Y-m' or anything you want
                }
            }
        }
        // load only the document payment period if it exist 
        return response()->json($projectDocument);
    }
    public function deleteDocumentPaymentPeriod(Request $request, $id)
    {
        ProjectDocumentPaymentPeriod::where('id', $id)->delete();
        return response()->json(['message' => $id]);
    }
}
