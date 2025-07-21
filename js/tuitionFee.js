// Tuition Fee Calculator Logic

document.addEventListener('DOMContentLoaded', function() {
    const courseCredits = document.getElementById('courseCredits');
    const perCreditFee = document.getElementById('perCreditFee');
    const semesterFee = document.getElementById('semesterFee');
    const waiver = document.getElementById('waiver');
    const scholarship = document.getElementById('scholarship');
    const calculateBtn = document.getElementById('calculateBtn');

    // Breakdown fields
    const bdCourseCredits = document.getElementById('bdCourseCredits');
    const bdPerCreditFee = document.getElementById('bdPerCreditFee');
    const bdSemesterFee = document.getElementById('bdSemesterFee');
    const bdWaiver = document.getElementById('bdWaiver');
    const bdScholarship = document.getElementById('bdScholarship');
    const bdTotalBefore = document.getElementById('bdTotalBefore');
    const bdTotalAfter = document.getElementById('bdTotalAfter');
    const bdInstallment1 = document.getElementById('bdInstallment1');
    const bdInstallment2 = document.getElementById('bdInstallment2');
    const bdInstallment3 = document.getElementById('bdInstallment3');
    const breakdownCard = document.getElementById('breakdownCard');

    function formatMoney(value) {
        return Number(value).toLocaleString('en-BD', { maximumFractionDigits: 2 });
    }

    calculateBtn.addEventListener('click', function() {
        // Get values
        const credits = parseFloat(courseCredits.value) || 0;
        const creditFee = parseFloat(perCreditFee.value) || 0;
        const semFee = parseFloat(semesterFee.value) || 0;
        const waiverVal = parseFloat(waiver.value) || 0;
        const scholarshipVal = parseFloat(scholarship.value) || 0;

        // Show input data
        bdCourseCredits.textContent = credits;
        bdPerCreditFee.textContent = formatMoney(creditFee) + ' ৳';
        bdSemesterFee.textContent = formatMoney(semFee) + ' ৳';
        bdWaiver.textContent = waiverVal + '%';
        bdScholarship.textContent = scholarshipVal + '%';

        // Calculate course fee
        const courseFee = credits * creditFee;
        // Total before any discount
        const totalBefore = courseFee + semFee;
        bdTotalBefore.textContent = formatMoney(totalBefore) + ' ৳';

        // Determine best discount
        let bestDiscount = 0;
        if (waiverVal > scholarshipVal) {
            bestDiscount = waiverVal;
        } else {
            bestDiscount = scholarshipVal;
        }

        // Apply discount only to course fee
        const discountedCourseFee = courseFee * (1 - bestDiscount / 100);
        const totalAfter = discountedCourseFee + semFee;
        bdTotalAfter.textContent = formatMoney(totalAfter) + ' ৳';

        // Installments
        const inst1 = totalAfter * 0.4;
        const inst2 = totalAfter * 0.3;
        const inst3 = totalAfter * 0.3;
        bdInstallment1.textContent = formatMoney(inst1) + ' ৳';
        bdInstallment2.textContent = formatMoney(inst2) + ' ৳';
        bdInstallment3.textContent = formatMoney(inst3) + ' ৳';

        // Show breakdown card with animation
        breakdownCard.classList.add('show');
        breakdownCard.style.display = 'block';
        // Scroll to breakdown card for better UX
        setTimeout(() => {
            breakdownCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 200);
    });
});
