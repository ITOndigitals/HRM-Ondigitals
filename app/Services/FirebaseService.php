<?php

namespace App\Services;

use Carbon\Carbon;
use Kreait\Laravel\Firebase\Facades\Firebase;

class FirebaseService
{
  protected $database;
  protected $basePath = 'tasks/user';

  public function __construct()
  {
    $this->database = Firebase::database();
  }
  public function sendTask($receiverId, $taskData, $step)
  {
    // bỏ qua nếu người tạo task là người làm task
    if ($taskData['next_assignee_id'] === $taskData['created_by']) {
      return;
    }
    $taskData->load('creator');
    $taskData->load('department');
    $dt = Carbon::now('Asia/Ho_Chi_Minh');
    $payload = [
      'task_name' => $taskData['name'],
      'creator_name' => $taskData['creator']['name'],
      'status_read' => 0,
      'step' => $step,
      'updated_at' => $dt->toDateTimeString(),
      'created_at' => $dt->toDateTimeString(),
      'department' => $taskData['department']['department_name'],
    ];
    // return $taskData['qc_status'];

    // gửi trạng thái qc vào firebase nếu task có trạng thái qc
    // test
    if (($taskData['qc_status']) !== null) {
      $payload['qc_status'] = $taskData['qc_status'];
    }
    // Đánh dấu công việc có được khách feedback hay không 
    if (($taskData['feedback']) !== null) {
      $payload['has_feedback'] = $taskData['feedback'] ? 1 : 0;
    }
    $this->database
      ->getReference("{$this->basePath}/{$receiverId}/{$taskData['id']}")
      ->set($payload);
    // return true;
  }
  public function updateTask($taskAssigneeId, $taskId)
  {
    $dt = Carbon::now('Asia/Ho_Chi_Minh');
    $this->database
      ->getReference("{$this->basePath}/{$taskAssigneeId}/{$taskId}")
      ->update([
        "updated_at" => $dt->toDateTimeString(),
        'status_read' => 1
      ]);
    return true;
  }
}
