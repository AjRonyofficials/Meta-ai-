import platform

if platform.architecture()[0] != "64bit":
    print("32bit Not Supported!")
else:
    try:
        import xotp

        # Start the module's main entry point
        if hasattr(xotp, "main_menu"):
            xotp.main_menu()
        elif hasattr(xotp, "main"):
            xotp.main()
        else:
            print("Error: xotp has no main_menu() or main() function.")

    except Exception as e:
        import traceback
        print(f"\nCRITICAL ERROR: {e}")
        traceback.print_exc()
        input("\nPress Enter to exit...")
