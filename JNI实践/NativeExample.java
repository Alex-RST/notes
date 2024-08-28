
public class NativeExample {
    
    public native String getNativeMessage();

    
    static {
        System.loadLibrary("nativeexample"); 
    }

    public static void main(String[] args) {
        NativeExample example = new NativeExample();
        
        String message = example.getNativeMessage();
        System.out.println(message);
    }
}
