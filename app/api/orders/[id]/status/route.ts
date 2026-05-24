import { NextResponse } from 'next/server';

// PATCH: Updates the order's tracking status flag and handles decline notes
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    // Destructure status along with decline details sent by your admin modal
    const { status, declineReason, declineNote } = body; 
    const orderId = params.id;

    if (!status) {
      return NextResponse.json(
        { success: false, message: "Missing required field: status" },
        { status: 400 }
      );
    }

    // This is where your live DB query goes later:
    // For a new or accepted status:
    // await Order.findByIdAndUpdate(orderId, { status });
    // 
    // For a declined status:
    // await Order.findByIdAndUpdate(orderId, { 
    //   status, 
    //   declineReason, 
    //   declineNote 
    // });

    // Return the response back to your dashboard state
    return NextResponse.json({ 
      success: true, 
      message: `Order ${orderId} status successfully updated to: ${status}`,
      updatedId: orderId,
      newStatus: status,
      // Pass these back so you can verify the payload structure matches
      declineDetails: status === "declined" ? { declineReason, declineNote } : null
    });
    
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message }, 
      { status: 500 }
    );
  }
}